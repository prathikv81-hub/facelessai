import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Common "../types/common";
import Types "../types/videos";
import YouTubeTypes "../types/youtube";

module {
  public func new(
    id : Common.VideoJobId,
    userId : Common.UserId,
    req : Types.CreateVideoRequest,
  ) : Types.VideoJob {
    let now = Time.now();
    let initialScript : ?Text = switch (req.mode) {
      case (#userScript({ script })) { ?script };
      case (#auto) { null };
    };
    {
      id;
      userId;
      title = req.title;
      prompt = req.prompt;
      mode = req.mode;
      var status = #pending;
      var currentStage = null;
      var script = initialScript;
      var voiceoverUrl = null;
      var videoUrl = null;
      var thumbnailUrl = null;
      var durationSeconds = null;
      var creditsSpent = 1; // 1 credit per video job
      var errorMessage = null;
      // Social sharing
      var shareToken = null;
      var shareUrl = null;
      // Analytics
      var viewCount = 0;
      var totalWatchTimeSecs = 0;
      var completionRatePercent = 0;
      var lastViewedAt = null;
      // YouTube publishing
      var youtubePublishStatus = #notPublished;
      var youtubeUrl = null;
      createdAt = now;
      var updatedAt = now;
    };
  };

  public func toPublic(self : Types.VideoJob) : Types.VideoJobPublic {
    {
      id = self.id;
      userId = self.userId;
      title = self.title;
      prompt = self.prompt;
      mode = self.mode;
      status = self.status;
      currentStage = self.currentStage;
      script = self.script;
      voiceoverUrl = self.voiceoverUrl;
      videoUrl = self.videoUrl;
      thumbnailUrl = self.thumbnailUrl;
      durationSeconds = self.durationSeconds;
      creditsSpent = self.creditsSpent;
      errorMessage = self.errorMessage;
      // Social sharing
      shareToken = self.shareToken;
      shareUrl = self.shareUrl;
      // Analytics
      viewCount = self.viewCount;
      totalWatchTimeSecs = self.totalWatchTimeSecs;
      completionRatePercent = self.completionRatePercent;
      lastViewedAt = self.lastViewedAt;
      // YouTube publishing
      youtubePublishStatus = self.youtubePublishStatus;
      youtubeUrl = self.youtubeUrl;
      createdAt = self.createdAt;
      updatedAt = self.updatedAt;
    };
  };

  public func getJob(
    jobs : Map.Map<Common.VideoJobId, Types.VideoJob>,
    jobId : Common.VideoJobId,
  ) : ?Types.VideoJob {
    jobs.get(jobId);
  };

  public func requireJob(
    jobs : Map.Map<Common.VideoJobId, Types.VideoJob>,
    jobId : Common.VideoJobId,
  ) : Types.VideoJob {
    switch (jobs.get(jobId)) {
      case (?j) { j };
      case null { Runtime.trap("Video job not found") };
    };
  };

  public func getUserJobs(
    jobs : Map.Map<Common.VideoJobId, Types.VideoJob>,
    userId : Common.UserId,
  ) : [Types.VideoJobPublic] {
    jobs.values()
      .filter(func(j) { j.userId == userId })
      .map(func(j : Types.VideoJob) : Types.VideoJobPublic { toPublic(j) })
      .toArray();
  };

  public func advanceStage(job : Types.VideoJob, stage : Types.PipelineStage) : () {
    job.status := #processing;
    job.currentStage := ?stage;
    job.updatedAt := Time.now();
  };

  public func markCompleted(job : Types.VideoJob) : () {
    job.status := #completed;
    job.currentStage := null;
    job.updatedAt := Time.now();
  };

  public func markFailed(job : Types.VideoJob, reason : Text) : () {
    job.status := #failed({ reason });
    job.currentStage := null;
    job.errorMessage := ?reason;
    job.updatedAt := Time.now();
  };

  public func creditsForJob(_ : Types.VideoJob) : Common.CreditsAmount {
    1; // 1 credit per video
  };
};
