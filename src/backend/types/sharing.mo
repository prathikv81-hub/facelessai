import Common "common";

module {
  // Public view of a video returned for unauthenticated share links
  public type VideoPublicView = {
    videoJobId : Common.VideoJobId;
    title : Text;
    description : Text;
    thumbnailUrl : ?Text;
    videoUrl : ?Text;
    viewCount : Nat;
    createdAt : Common.Timestamp;
  };
};
