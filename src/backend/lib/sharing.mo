import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Common "../types/common";
import VideoTypes "../types/videos";
import SharingTypes "../types/sharing";

module {
  // Generates a unique share token and assigns it to a video job.
  // Ownership is checked — only the video's owner can generate a share link.
  // Returns the full share URL (or empty string if unauthorized / not found).
  public func generateShareToken(
    videoJobs : Map.Map<Common.VideoJobId, VideoTypes.VideoJob>,
    shareTokenIndex : Map.Map<Text, Common.VideoJobId>,
    videoId : Common.VideoJobId,
    caller : Common.UserId,
    canisterBaseUrl : Text,
  ) : Text {
    let job = switch (videoJobs.get(videoId)) {
      case (?j) { j };
      case null { return "" };
    };
    if (job.userId != caller) {
      return "";
    };
    // Reuse existing token if already generated
    let token : Text = switch (job.shareToken) {
      case (?t) { t };
      case null {
        // Derive a deterministic-but-opaque token from videoId + createdAt + caller
        let raw = videoId.toText() # "-" # job.createdAt.toText() # "-" # caller.toText();
        let hash = raw.encodeUtf8();
        let hexChars = "0123456789abcdef";
        let hexArr = hexChars.toArray();
        var tok = "";
        for (b in hash.values()) {
          let hi = b.toNat() / 16;
          let lo = b.toNat() % 16;
          tok := tok # Text.fromChar(hexArr[hi]) # Text.fromChar(hexArr[lo]);
        };
        // Trim to 32 chars for a reasonable URL length
        let tokArr = tok.toArray();
        if (tokArr.size() > 32) {
          Text.fromArray(tokArr.sliceToArray(0, 32));
        } else { tok };
      };
    };
    let shareUrl = canisterBaseUrl # "/share/" # token;
    job.shareToken := ?token;
    job.shareUrl := ?shareUrl;
    job.updatedAt := Time.now();
    shareTokenIndex.add(token, videoId);
    shareUrl;
  };

  // Returns a public view of a video by share token (no auth required).
  // Pure read — does NOT modify state. Call recordEngagement separately to record a view.
  public func getPublicVideo(
    videoJobs : Map.Map<Common.VideoJobId, VideoTypes.VideoJob>,
    shareTokenIndex : Map.Map<Text, Common.VideoJobId>,
    token : Text,
  ) : ?SharingTypes.VideoPublicView {
    let videoId = switch (shareTokenIndex.get(token)) {
      case (?id) { id };
      case null { return null };
    };
    switch (videoJobs.get(videoId)) {
      case null { null };
      case (?job) {
        ?{
          videoJobId = job.id;
          title = job.title;
          description = job.prompt;
          thumbnailUrl = switch (job.thumbnailUrl) {
            case (?t) { t.decodeUtf8() };
            case null { null };
          };
          videoUrl = switch (job.videoUrl) {
            case (?v) { v.decodeUtf8() };
            case null { null };
          };
          viewCount = job.viewCount;
          createdAt = job.createdAt;
        };
      };
    };
  };

  // Increments viewCount on the video and updates lastViewedAt.
  public func recordView(
    videoJobs : Map.Map<Common.VideoJobId, VideoTypes.VideoJob>,
    videoId : Common.VideoJobId,
  ) : () {
    switch (videoJobs.get(videoId)) {
      case null { };
      case (?job) {
        job.viewCount := job.viewCount + 1;
        job.lastViewedAt := ?Time.now();
        job.updatedAt := Time.now();
      };
    };
  };

  // Records engagement metrics (watch time + completion) for a video.
  // Uses a running average for completion rate.
  public func recordEngagement(
    videoJobs : Map.Map<Common.VideoJobId, VideoTypes.VideoJob>,
    videoId : Common.VideoJobId,
    watchTimeSecs : Nat,
    completionPercent : Nat,
  ) : () {
    switch (videoJobs.get(videoId)) {
      case null { };
      case (?job) {
        job.totalWatchTimeSecs := job.totalWatchTimeSecs + watchTimeSecs;
        // Clamp completionPercent to 0-100
        let clamped = if (completionPercent > 100) { 100 } else { completionPercent };
        // Rolling average weighted by view count
        let views = if (job.viewCount > 0) { job.viewCount } else { 1 };
        let newRate = (job.completionRatePercent * (views - 1) + clamped) / views;
        job.completionRatePercent := newRate;
        job.updatedAt := Time.now();
      };
    };
  };
};
