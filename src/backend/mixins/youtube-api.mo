import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Common "../types/common";
import UserTypes "../types/users";
import VideoTypes "../types/videos";
import YouTubeTypes "../types/youtube";
import YouTubeLib "../lib/youtube";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
  videoJobs : Map.Map<Common.VideoJobId, VideoTypes.VideoJob>,
  youtubeClientId : { var value : Text },
  youtubeClientSecret : { var value : Text },
  transform : OutCall.Transform,
) {
  // Exchange OAuth authorization code for tokens and store them on user profile
  public shared ({ caller }) func connectYouTube(authCode : Text, redirectUri : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    await YouTubeLib.connectYouTube(
      userProfiles,
      caller,
      authCode,
      redirectUri,
      youtubeClientId.value,
      youtubeClientSecret.value,
      transform,
    );
  };

  // Remove YouTube tokens from user profile
  public shared ({ caller }) func disconnectYouTube() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    YouTubeLib.disconnectYouTube(userProfiles, caller);
  };

  // Return connection status and channel name (no tokens)
  public shared ({ caller }) func getYouTubeConnection() : async YouTubeTypes.YouTubeConnectionStatus {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    YouTubeLib.getYouTubeConnection(userProfiles, caller);
  };

  // Upload a completed video to YouTube
  public shared ({ caller }) func publishToYouTube(
    videoId : Common.VideoJobId,
    request : YouTubeTypes.PublishToYouTubeRequest,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    await YouTubeLib.publishToYouTube(
      userProfiles,
      videoJobs,
      caller,
      videoId,
      request,
      transform,
    );
  };
};
