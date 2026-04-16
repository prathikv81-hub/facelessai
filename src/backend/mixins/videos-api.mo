import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import UserTypes "../types/users";
import VideoTypes "../types/videos";
import UserLib "../lib/users";
import VideoLib "../lib/videos";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
  videoJobs : Map.Map<Common.VideoJobId, VideoTypes.VideoJob>,
  nextJobId : { var value : Common.VideoJobId },
  openAiKey : { var value : Text },
  replicateKey : { var value : Text },
) {
  public shared ({ caller }) func submitVideoJob(req : VideoTypes.CreateVideoRequest) : async Common.VideoJobId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found. Please complete your profile first.") };
      case (?p) { p };
    };
    if (profile.creditBalance < 1) {
      Runtime.trap("Insufficient credits. Please purchase a subscription to generate videos.");
    };
    let jobId = nextJobId.value;
    nextJobId.value := nextJobId.value + 1;
    let job = VideoLib.new(jobId, caller, req);
    videoJobs.add(jobId, job);
    // Deduct 1 credit upfront
    UserLib.deductCredits(profile, 1);
    jobId;
  };

  public query ({ caller }) func getVideoJob(jobId : Common.VideoJobId) : async ?VideoTypes.VideoJobPublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (videoJobs.get(jobId)) {
      case (null) { null };
      case (?job) {
        // Only the owner or admin can view the job
        if (job.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Not your video job");
        };
        ?job.toPublic();
      };
    };
  };

  public query ({ caller }) func listUserVideoJobs() : async [VideoTypes.VideoJobPublic] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    VideoLib.getUserJobs(videoJobs, caller);
  };

  public shared ({ caller }) func deleteVideoJob(jobId : Common.VideoJobId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let job = VideoLib.requireJob(videoJobs, jobId);
    if (job.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Not your video job");
    };
    videoJobs.remove(jobId);
  };

  public shared ({ caller }) func updateVideoJobStatus(
    jobId : Common.VideoJobId,
    stage : ?VideoTypes.PipelineStage,
    script : ?Text,
    completed : Bool,
    failed : Bool,
    failReason : ?Text,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let job = VideoLib.requireJob(videoJobs, jobId);
    if (job.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Not your video job");
    };
    if (completed) {
      VideoLib.markCompleted(job);
    } else if (failed) {
      let reason = switch (failReason) {
        case (?r) { r };
        case null { "Unknown error" };
      };
      VideoLib.markFailed(job, reason);
    } else {
      switch (stage) {
        case (?s) { VideoLib.advanceStage(job, s) };
        case null {};
      };
      switch (script) {
        case (?s) { job.script := ?s };
        case null {};
      };
    };
  };

  public shared ({ caller }) func setOpenAiKey(key : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set API keys");
    };
    openAiKey.value := key;
  };

  public shared ({ caller }) func setReplicateKey(key : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set API keys");
    };
    replicateKey.value := key;
  };
};
