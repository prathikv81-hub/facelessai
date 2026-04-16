import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import VideoTypes "../types/videos";
import AnalyticsTypes "../types/analytics";
import AnalyticsLib "../lib/analytics";

mixin (
  accessControlState : AccessControl.AccessControlState,
  videoJobs : Map.Map<Common.VideoJobId, VideoTypes.VideoJob>,
) {
  // Returns analytics for a single video owned by the caller
  public shared ({ caller }) func getVideoAnalytics(videoId : Common.VideoJobId) : async ?AnalyticsTypes.VideoAnalytics {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    AnalyticsLib.getVideoAnalytics(videoJobs, videoId, caller);
  };

  // Returns aggregate analytics across all videos for the caller
  public shared ({ caller }) func getDashboardAnalytics() : async AnalyticsTypes.DashboardAnalytics {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    AnalyticsLib.getDashboardAnalytics(videoJobs, caller);
  };
};
