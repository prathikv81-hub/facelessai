import Common "common";

module {
  // Per-video analytics snapshot returned to the caller
  public type VideoAnalytics = {
    videoJobId : Common.VideoJobId;
    viewCount : Nat;
    totalWatchTimeSecs : Nat;
    completionRatePercent : Nat;
    lastViewedAt : ?Common.Timestamp;
  };

  // Aggregate analytics across all videos owned by a user
  public type DashboardAnalytics = {
    totalViews : Nat;
    totalWatchTimeHours : Nat;
    avgCompletionRate : Nat;
    totalVideos : Nat;
  };
};
