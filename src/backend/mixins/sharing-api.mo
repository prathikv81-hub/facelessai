import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import UserTypes "../types/users";
import VideoTypes "../types/videos";
import SharingTypes "../types/sharing";
import SharingLib "../lib/sharing";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
  videoJobs : Map.Map<Common.VideoJobId, VideoTypes.VideoJob>,
  shareTokenIndex : Map.Map<Text, Common.VideoJobId>,
) {
  // Generate a shareable token/URL for a video (authenticated)
  public shared ({ caller }) func generateShareLink(videoId : Common.VideoJobId) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    // Derive base URL from the caller's identity — use a stable canister URL pattern
    let baseUrl = "https://facelessai.app";
    SharingLib.generateShareToken(videoJobs, shareTokenIndex, videoId, caller, baseUrl);
  };

  // Public endpoint — no auth required; also increments view count
  public query func getPublicVideo(token : Text) : async ?SharingTypes.VideoPublicView {
    SharingLib.getPublicVideo(videoJobs, shareTokenIndex, token);
  };

  // Record watch-time and completion analytics for a video (public, called by viewer).
  // Also increments the view count on every call.
  public func recordVideoEngagement(
    videoId : Common.VideoJobId,
    watchTimeSecs : Nat,
    completionPercent : Nat,
  ) : async () {
    SharingLib.recordView(videoJobs, videoId);
    SharingLib.recordEngagement(videoJobs, videoId, watchTimeSecs, completionPercent);
  };
};
