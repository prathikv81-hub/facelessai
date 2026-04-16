import Map "mo:core/Map";
import Common "../types/common";
import VideoTypes "../types/videos";
import AnalyticsTypes "../types/analytics";

module {
  // Returns per-video analytics for a single video owned by the caller.
  public func getVideoAnalytics(
    videoJobs : Map.Map<Common.VideoJobId, VideoTypes.VideoJob>,
    videoId : Common.VideoJobId,
    caller : Common.UserId,
  ) : ?AnalyticsTypes.VideoAnalytics {
    switch (videoJobs.get(videoId)) {
      case null { null };
      case (?job) {
        if (job.userId != caller) { return null };
        ?{
          videoJobId = job.id;
          viewCount = job.viewCount;
          totalWatchTimeSecs = job.totalWatchTimeSecs;
          completionRatePercent = job.completionRatePercent;
          lastViewedAt = job.lastViewedAt;
        };
      };
    };
  };

  // Aggregates analytics across all videos owned by the caller.
  public func getDashboardAnalytics(
    videoJobs : Map.Map<Common.VideoJobId, VideoTypes.VideoJob>,
    caller : Common.UserId,
  ) : AnalyticsTypes.DashboardAnalytics {
    var totalViews = 0;
    var totalWatchTimeSecs = 0;
    var totalCompletionSum = 0;
    var totalVideos = 0;

    for ((_, job) in videoJobs.entries()) {
      if (job.userId == caller) {
        totalVideos := totalVideos + 1;
        totalViews := totalViews + job.viewCount;
        totalWatchTimeSecs := totalWatchTimeSecs + job.totalWatchTimeSecs;
        totalCompletionSum := totalCompletionSum + job.completionRatePercent;
      };
    };

    let avgCompletionRate = if (totalVideos > 0) {
      totalCompletionSum / totalVideos;
    } else { 0 };

    {
      totalViews;
      totalWatchTimeHours = totalWatchTimeSecs / 3600;
      avgCompletionRate;
      totalVideos;
    };
  };
};
