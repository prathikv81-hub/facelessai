import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Common "../types/common";
import Types "../types/users";

module {
  public func new(id : Common.UserId, displayName : Text, email : Text) : Types.UserProfile {
    let now = Time.now();
    {
      id;
      var displayName = displayName;
      var email = email;
      var creditBalance = 0;
      var subscription = null;
      var stripeCustomerId = null;
      var brandKit = null;
      var youtubeConnection = null;
      createdAt = now;
      var updatedAt = now;
    };
  };

  public func toPublic(self : Types.UserProfile) : Types.UserProfilePublic {
    {
      id = self.id;
      displayName = self.displayName;
      email = self.email;
      creditBalance = self.creditBalance;
      subscription = self.subscription;
      stripeCustomerId = self.stripeCustomerId;
      brandKit = self.brandKit;
      youtubeConnection = switch (self.youtubeConnection) {
        case null null;
        case (?yt) ?{
          accessToken = yt.accessToken;
          refreshToken = yt.refreshToken;
          channelName = yt.channelName;
          channelId = yt.channelId;
          connectedAt = yt.connectedAt;
        };
      };
      createdAt = self.createdAt;
      updatedAt = self.updatedAt;
    };
  };

  public func getProfile(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    userId : Common.UserId,
  ) : ?Types.UserProfile {
    profiles.get(userId);
  };

  public func requireProfile(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    userId : Common.UserId,
  ) : Types.UserProfile {
    switch (profiles.get(userId)) {
      case (?p) { p };
      case null { Runtime.trap("User profile not found") };
    };
  };

  public func upsertProfile(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    profile : Types.UserProfile,
  ) : () {
    profiles.add(profile.id, profile);
  };

  public func deductCredits(
    profile : Types.UserProfile,
    amount : Common.CreditsAmount,
  ) : () {
    if (profile.creditBalance < amount) {
      Runtime.trap("Insufficient credits");
    };
    profile.creditBalance := profile.creditBalance - amount;
    profile.updatedAt := Time.now();
  };

  public func replenishCredits(
    profile : Types.UserProfile,
    tier : Types.SubscriptionTier,
  ) : () {
    profile.creditBalance := profile.creditBalance + creditsForTier(tier);
    profile.updatedAt := Time.now();
  };

  public func creditsForTier(tier : Types.SubscriptionTier) : Common.CreditsAmount {
    switch (tier) {
      case (#starter) { 10 };
      case (#pro) { 30 };
      case (#enterprise) { 100 };
    };
  };

  public func setSubscription(
    profile : Types.UserProfile,
    subscription : Types.Subscription,
  ) : () {
    profile.subscription := ?subscription;
    profile.stripeCustomerId := ?subscription.stripeCustomerId;
    profile.updatedAt := Time.now();
  };
};
