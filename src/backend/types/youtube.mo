module {
  // YouTube OAuth connection info stored on UserProfile (mutable, internal)
  public type YouTubeConnection = {
    var accessToken : Text;
    var refreshToken : Text;
    var channelName : Text;
    var channelId : Text;
    var connectedAt : Int; // Timestamp
  };

  // Immutable/shared version of YouTubeConnection for API boundary
  public type YouTubeConnectionPublic = {
    accessToken : Text;
    refreshToken : Text;
    channelName : Text;
    channelId : Text;
    connectedAt : Int;
  };

  // Visibility options for YouTube uploads
  public type YouTubeVisibility = {
    #public_;
    #unlisted;
    #private_;
  };

  // Request payload for publishing a video to YouTube
  public type PublishToYouTubeRequest = {
    title : Text;
    description : Text;
    tags : [Text];
    visibility : YouTubeVisibility;
  };

  // Status of a YouTube publish attempt
  public type YouTubePublishStatus = {
    #notPublished;
    #publishing;
    #published;
    #failed;
  };

  // Connection status returned to the caller (no tokens exposed)
  public type YouTubeConnectionStatus = {
    connected : Bool;
    channelName : ?Text;
    channelId : ?Text;
  };
};
