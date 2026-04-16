import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Common "../types/common";
import UserTypes "../types/users";
import VideoTypes "../types/videos";
import YouTubeTypes "../types/youtube";

module {
  // JSON escaping helper
  func escapeJson(s : Text) : Text {
    let dq = "\"";
    let bs = "\\";
    s
      .replace(#text bs, bs # bs)
      .replace(#text dq, bs # dq)
      .replace(#char '\n', "\\n")
      .replace(#char '\r', "\\r")
      .replace(#char '\t', "\\t");
  };

  // Extract a JSON field value from a simple flat JSON object.
  // Looks for "key":"value" pattern, returns ?value.
  func extractJsonField(json : Text, field : Text) : ?Text {
    let marker = "\"" # field # "\":\"";
    let parts = json.split(#text marker);
    let arr = parts.toArray();
    if (arr.size() < 2) { return null };
    let after = arr[1];
    let chars = after.toArray();
    var result = "";
    var i = 0;
    var done = false;
    while (i < chars.size() and not done) {
      let c = chars[i];
      if (c == '\\' and i + 1 < chars.size()) {
        let next = chars[i + 1];
        result := result # Text.fromChar(next);
        i := i + 2;
      } else if (Text.fromChar(c) == "\"") {
        done := true;
      } else {
        result := result # Text.fromChar(c);
        i := i + 1;
      };
    };
    if (result.size() > 0) { ?result } else { null };
  };

  // Exchanges an OAuth auth code for access/refresh tokens and stores them on the user profile.
  public func connectYouTube(
    userProfiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
    caller : Common.UserId,
    authCode : Text,
    redirectUri : Text,
    clientId : Text,
    clientSecret : Text,
    transform : OutCall.Transform,
  ) : async () {
    let profile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case null { Runtime.trap("User profile not found") };
    };

    // Exchange auth code for tokens via Google OAuth2 token endpoint
    let body = "code=" # authCode
      # "&client_id=" # clientId
      # "&client_secret=" # clientSecret
      # "&redirect_uri=" # redirectUri
      # "&grant_type=authorization_code";

    let headers : [OutCall.Header] = [
      { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
    ];

    let tokenResponse = await OutCall.httpPostRequest(
      "https://oauth2.googleapis.com/token",
      headers,
      body,
      transform,
    );

    let accessToken = switch (extractJsonField(tokenResponse, "access_token")) {
      case (?t) { t };
      case null { Runtime.trap("Failed to extract access_token from OAuth response") };
    };
    let refreshToken = switch (extractJsonField(tokenResponse, "refresh_token")) {
      case (?t) { t };
      case null { "" }; // refresh_token may not be present on every response
    };

    // Fetch channel info using the access token
    let channelHeaders : [OutCall.Header] = [
      { name = "Authorization"; value = "Bearer " # accessToken },
    ];
    let channelResponse = await OutCall.httpGetRequest(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
      channelHeaders,
      transform,
    );

    let channelName = switch (extractJsonField(channelResponse, "title")) {
      case (?n) { n };
      case null { "Unknown Channel" };
    };
    let channelId = switch (extractJsonField(channelResponse, "id")) {
      case (?id) { id };
      case null { "" };
    };

    let connection : YouTubeTypes.YouTubeConnection = {
      var accessToken = accessToken;
      var refreshToken = refreshToken;
      var channelName = channelName;
      var channelId = channelId;
      var connectedAt = Time.now();
    };
    profile.youtubeConnection := ?connection;
    profile.updatedAt := Time.now();
  };

  // Removes YouTube tokens from the user profile.
  public func disconnectYouTube(
    userProfiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
    caller : Common.UserId,
  ) : () {
    switch (userProfiles.get(caller)) {
      case null { Runtime.trap("User profile not found") };
      case (?profile) {
        profile.youtubeConnection := null;
        profile.updatedAt := Time.now();
      };
    };
  };

  // Returns the current YouTube connection status for the caller.
  public func getYouTubeConnection(
    userProfiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
    caller : Common.UserId,
  ) : YouTubeTypes.YouTubeConnectionStatus {
    switch (userProfiles.get(caller)) {
      case null { { connected = false; channelName = null; channelId = null } };
      case (?profile) {
        switch (profile.youtubeConnection) {
          case null { { connected = false; channelName = null; channelId = null } };
          case (?yt) {
            {
              connected = true;
              channelName = ?yt.channelName;
              channelId = ?yt.channelId;
            };
          };
        };
      };
    };
  };

  // Builds visibility string for YouTube API
  func visibilityToText(v : YouTubeTypes.YouTubeVisibility) : Text {
    switch (v) {
      case (#public_) { "public" };
      case (#unlisted) { "unlisted" };
      case (#private_) { "private" };
    };
  };

  // Build JSON array of tag strings
  func buildTagsJson(tags : [Text]) : Text {
    let parts = tags.map(func(t : Text) : Text { "\"" # escapeJson(t) # "\"" });
    "[" # parts.values().join(",") # "]";
  };

  // Initiates a YouTube upload for a completed video job using the YouTube Data API v3.
  public func publishToYouTube(
    userProfiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
    videoJobs : Map.Map<Common.VideoJobId, VideoTypes.VideoJob>,
    caller : Common.UserId,
    videoId : Common.VideoJobId,
    request : YouTubeTypes.PublishToYouTubeRequest,
    transform : OutCall.Transform,
  ) : async () {
    let profile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case null { Runtime.trap("User profile not found") };
    };
    let yt = switch (profile.youtubeConnection) {
      case (?c) { c };
      case null { Runtime.trap("YouTube account not connected") };
    };
    let job = switch (videoJobs.get(videoId)) {
      case (?j) { j };
      case null { Runtime.trap("Video job not found") };
    };
    if (job.userId != caller) {
      Runtime.trap("Unauthorized: not the owner of this video");
    };
    let videoUrlText = switch (job.videoUrl) {
      case (?v) {
        switch (v.decodeUtf8()) {
          case (?url) { url };
          case null { Runtime.trap("Video URL blob is not valid UTF-8") };
        }
      };
      case null { Runtime.trap("Video URL not available — video generation not complete") };
    };

    // Mark as publishing
    job.youtubePublishStatus := #publishing;
    job.updatedAt := Time.now();

    // Build the metadata insert request body
    let tagsJson = buildTagsJson(request.tags);
    let metadataBody = "{\"snippet\":{\"title\":\"" # escapeJson(request.title)
      # "\",\"description\":\"" # escapeJson(request.description)
      # "\",\"tags\":" # tagsJson
      # "},\"status\":{\"privacyStatus\":\"" # visibilityToText(request.visibility) # "\"}}";

    // Use resumable upload API — initiate with metadata, then supply video URL
    let uploadHeaders : [OutCall.Header] = [
      { name = "Authorization"; value = "Bearer " # yt.accessToken },
      { name = "Content-Type"; value = "application/json; charset=UTF-8" },
      { name = "X-Upload-Content-Type"; value = "video/*" },
      { name = "X-Video-Source-Url"; value = videoUrlText },
    ];

    let uploadResponse = await OutCall.httpPostRequest(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status",
      uploadHeaders,
      metadataBody,
      transform,
    );

    let youtubeVideoId = switch (extractJsonField(uploadResponse, "id")) {
      case (?id) { id };
      case null {
        job.youtubePublishStatus := #failed;
        job.updatedAt := Time.now();
        Runtime.trap("YouTube upload failed — no video ID in response");
      };
    };

    let youtubeUrl = "https://www.youtube.com/watch?v=" # youtubeVideoId;
    job.youtubePublishStatus := #published;
    job.youtubeUrl := ?youtubeUrl;
    job.updatedAt := Time.now();
  };
};
