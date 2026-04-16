import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Common "../types/common";
import UserTypes "../types/users";
import SubTypes "../types/subscriptions";
import UserLib "../lib/users";
import SubLib "../lib/subscriptions";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
  stripeConfig : { var value : ?Stripe.StripeConfiguration },
  transform : OutCall.Transform,
) {
  public query func getSubscriptionTiers() : async [SubTypes.TierConfig] {
    SubLib.allTiers();
  };

  public shared ({ caller }) func createSubscriptionCheckout(
    tier : UserTypes.SubscriptionTier,
    successUrl : Text,
    cancelUrl : Text,
  ) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let config = switch (stripeConfig.value) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?c) { c };
    };
    let tierConfig = SubLib.getTierConfig(tier);
    let items : [Stripe.ShoppingItem] = [
      {
        currency = "usd";
        productName = tierConfig.name # " Plan";
        productDescription = tierConfig.description;
        priceInCents = tierConfig.priceInCents;
        quantity = 1;
      },
    ];
    await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transform);
  };

  public shared ({ caller }) func handleStripeWebhook(payload : Text) : async () {
    // Parse the webhook event from Stripe payload
    let event = switch (SubLib.parseWebhookEvent(payload)) {
      case (null) { Runtime.trap("Invalid webhook payload") };
      case (?e) { e };
    };

    // Handle subscription lifecycle events
    if (event.eventType == "checkout.session.completed") {
      // Find user by customer ID and activate their subscription
      let tierOpt = SubLib.tierFromStripePriceId(event.subscriptionId);
      let tier = switch (tierOpt) {
        case (?t) { t };
        case null { #starter }; // default tier if price not found
      };
      // Find or create user profile by stripe customer ID
      for ((_, profile) in userProfiles.entries()) {
        if (profile.stripeCustomerId == ?event.customerId) {
          let sub : UserTypes.Subscription = {
            tier;
            status = #active;
            stripeSubscriptionId = event.subscriptionId;
            stripeCustomerId = event.customerId;
            currentPeriodEnd = Time.now() + 2_592_000_000_000_000; // ~30 days in nanoseconds
            createdAt = Time.now();
          };
          UserLib.setSubscription(profile, sub);
          UserLib.replenishCredits(profile, tier);
        };
      };
    } else if (event.eventType == "customer.subscription.updated") {
      for ((_, profile) in userProfiles.entries()) {
        if (profile.stripeCustomerId == ?event.customerId) {
          switch (profile.subscription) {
            case (?existing) {
              let tierOpt = SubLib.tierFromStripePriceId(event.subscriptionId);
              let newTier = switch (tierOpt) {
                case (?t) { t };
                case null { existing.tier };
              };
              let updated : UserTypes.Subscription = {
                existing with
                tier = newTier;
                status = #active;
                currentPeriodEnd = Time.now() + 2_592_000_000_000_000;
              };
              UserLib.setSubscription(profile, updated);
              UserLib.replenishCredits(profile, newTier);
            };
            case null {};
          };
        };
      };
    } else if (event.eventType == "customer.subscription.deleted") {
      for ((_, profile) in userProfiles.entries()) {
        if (profile.stripeCustomerId == ?event.customerId) {
          switch (profile.subscription) {
            case (?existing) {
              let cancelled : UserTypes.Subscription = {
                existing with
                status = #cancelled;
              };
              profile.subscription := ?cancelled;
            };
            case null {};
          };
        };
      };
    } else if (event.eventType == "invoice.payment_succeeded") {
      // Credit replenishment on subscription renewal
      for ((_, profile) in userProfiles.entries()) {
        if (profile.stripeCustomerId == ?event.customerId) {
          switch (profile.subscription) {
            case (?sub) {
              if (sub.status == #active) {
                UserLib.replenishCredits(profile, sub.tier);
              };
            };
            case null {};
          };
        };
      };
    };
  };

  public shared ({ caller }) func cancelSubscription() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        switch (profile.subscription) {
          case (null) { Runtime.trap("No active subscription") };
          case (?sub) {
            let cancelled : UserTypes.Subscription = {
              sub with
              status = #cancelled;
            };
            profile.subscription := ?cancelled;
          };
        };
      };
    };
  };
};
