import Common "common";
import BrandKitTypes "brandkit";
import YouTubeTypes "youtube";

module {
  public type SubscriptionTier = {
    #starter;   // 10 credits/month
    #pro;       // 30 credits/month
    #enterprise; // 100 credits/month
  };

  public type SubscriptionStatus = {
    #active;
    #cancelled;
    #expired;
    #none;
  };

  public type Subscription = {
    tier : SubscriptionTier;
    status : SubscriptionStatus;
    stripeSubscriptionId : Text;
    stripeCustomerId : Text;
    currentPeriodEnd : Common.Timestamp;
    createdAt : Common.Timestamp;
  };

  public type UserProfile = {
    id : Common.UserId;
    var displayName : Text;
    var email : Text;
    var creditBalance : Common.CreditsAmount;
    var subscription : ?Subscription;
    var stripeCustomerId : ?Text;
    var brandKit : ?BrandKitTypes.BrandKit;
    var youtubeConnection : ?YouTubeTypes.YouTubeConnection;
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
  };

  // Shared (immutable) version for API boundary
  public type UserProfilePublic = {
    id : Common.UserId;
    displayName : Text;
    email : Text;
    creditBalance : Common.CreditsAmount;
    subscription : ?Subscription;
    stripeCustomerId : ?Text;
    brandKit : ?BrandKitTypes.BrandKit;
    youtubeConnection : ?YouTubeTypes.YouTubeConnectionPublic;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };
};
