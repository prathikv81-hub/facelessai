import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";
import YouTubeTypes "youtube";

module {
  public type VideoJobStatus = {
    #pending;
    #processing;
    #completed;
    #failed : { reason : Text };
  };

  public type PipelineStage = {
    #script;
    #voiceover;
    #images;
    #assembly;
  };

  public type GenerationMode = {
    #auto;        // full auto-generation from topic/prompt
    #userScript : { script : Text }; // user-supplied script
  };

  public type VideoJob = {
    id : Common.VideoJobId;
    userId : Common.UserId;
    title : Text;
    prompt : Text;
    mode : GenerationMode;
    var status : VideoJobStatus;
    var currentStage : ?PipelineStage;
    var script : ?Text;
    var voiceoverUrl : ?Storage.ExternalBlob;
    var videoUrl : ?Storage.ExternalBlob;
    var thumbnailUrl : ?Storage.ExternalBlob;
    var durationSeconds : ?Nat;
    var creditsSpent : Common.CreditsAmount;
    var errorMessage : ?Text;
    // Social sharing
    var shareToken : ?Text;
    var shareUrl : ?Text;
    // Analytics
    var viewCount : Nat;
    var totalWatchTimeSecs : Nat;
    var completionRatePercent : Nat;
    var lastViewedAt : ?Common.Timestamp;
    // YouTube publishing
    var youtubePublishStatus : YouTubeTypes.YouTubePublishStatus;
    var youtubeUrl : ?Text;
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
  };

  // Shared (immutable) version for API boundary
  public type VideoJobPublic = {
    id : Common.VideoJobId;
    userId : Common.UserId;
    title : Text;
    prompt : Text;
    mode : GenerationMode;
    status : VideoJobStatus;
    currentStage : ?PipelineStage;
    script : ?Text;
    voiceoverUrl : ?Storage.ExternalBlob;
    videoUrl : ?Storage.ExternalBlob;
    thumbnailUrl : ?Storage.ExternalBlob;
    durationSeconds : ?Nat;
    creditsSpent : Common.CreditsAmount;
    errorMessage : ?Text;
    // Social sharing
    shareToken : ?Text;
    shareUrl : ?Text;
    // Analytics
    viewCount : Nat;
    totalWatchTimeSecs : Nat;
    completionRatePercent : Nat;
    lastViewedAt : ?Common.Timestamp;
    // YouTube publishing
    youtubePublishStatus : YouTubeTypes.YouTubePublishStatus;
    youtubeUrl : ?Text;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type CreateVideoRequest = {
    title : Text;
    prompt : Text;
    mode : GenerationMode;
  };
};
