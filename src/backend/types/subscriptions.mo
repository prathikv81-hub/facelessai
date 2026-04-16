import Common "common";
import Users "users";

module {
  public type TierConfig = {
    tier : Users.SubscriptionTier;
    creditsPerMonth : Common.CreditsAmount;
    priceInCents : Nat;
    name : Text;
    description : Text;
    stripePriceId : Text;
  };

  public type StripeWebhookEvent = {
    eventType : Text;
    sessionId : Text;
    customerId : Text;
    subscriptionId : Text;
    payload : Text;
  };

  public type CheckoutSessionResult = {
    sessionId : Text;
    url : Text;
  };
};
