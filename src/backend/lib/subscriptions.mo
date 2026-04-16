import UserTypes "../types/users";
import SubTypes "../types/subscriptions";

module {
  public func getTierConfig(tier : UserTypes.SubscriptionTier) : SubTypes.TierConfig {
    switch (tier) {
      case (#starter) {
        {
          tier = #starter;
          creditsPerMonth = 10;
          priceInCents = 999;
          name = "Starter";
          description = "10 video credits per month — perfect for new creators";
          stripePriceId = "price_starter";
        };
      };
      case (#pro) {
        {
          tier = #pro;
          creditsPerMonth = 30;
          priceInCents = 2499;
          name = "Pro";
          description = "30 video credits per month — for growing channels";
          stripePriceId = "price_pro";
        };
      };
      case (#enterprise) {
        {
          tier = #enterprise;
          creditsPerMonth = 100;
          priceInCents = 6999;
          name = "Enterprise";
          description = "100 video credits per month — for power creators";
          stripePriceId = "price_enterprise";
        };
      };
    };
  };

  public func allTiers() : [SubTypes.TierConfig] {
    [
      getTierConfig(#starter),
      getTierConfig(#pro),
      getTierConfig(#enterprise),
    ];
  };

  public func tierFromStripePriceId(priceId : Text) : ?UserTypes.SubscriptionTier {
    if (priceId == "price_starter") { return ?#starter };
    if (priceId == "price_pro") { return ?#pro };
    if (priceId == "price_enterprise") { return ?#enterprise };
    null;
  };

  // Parse a minimal JSON webhook payload — extract known fields by text search.
  // Returns null if required fields are missing.
  public func parseWebhookEvent(payload : Text) : ?SubTypes.StripeWebhookEvent {
    let eventType = extractJsonField(payload, "type");
    let sessionId = extractJsonField(payload, "id");
    let customerId = extractJsonField(payload, "customer");
    let subscriptionId = extractJsonField(payload, "subscription");

    switch (eventType) {
      case (null) { null };
      case (?et) {
        ?{
          eventType = et;
          sessionId = switch (sessionId) { case (?v) v; case null "" };
          customerId = switch (customerId) { case (?v) v; case null "" };
          subscriptionId = switch (subscriptionId) { case (?v) v; case null "" };
          payload = payload;
        };
      };
    };
  };

  // Extract a simple string value for a given key from a JSON text.
  // Handles `"key":"value"` and `"key": "value"` patterns.
  func isWhitespace(c : Char) : Bool {
    c == ' ' or c == '\t' or c == '\n' or c == '\r';
  };

  func isValueTerminator(c : Char) : Bool {
    c == ',' or c == '}' or c == ' ' or c == '\n' or c == '\r';
  };

  func extractJsonField(json : Text, key : Text) : ?Text {
    let needle = "\"" # key # "\"";
    let parts = json.split(#text needle);
    let partsArr = parts.toArray();
    if (partsArr.size() < 2) { return null };
    let after = partsArr[1];
    // skip whitespace and colon
    let colonParts = after.split(#char ':');
    let colonArr = colonParts.toArray();
    if (colonArr.size() < 2) { return null };
    let valuePart = colonArr[1];
    // trim leading whitespace
    let trimmed = valuePart.trimStart(#predicate isWhitespace);
    if (trimmed.size() == 0) { return null };
    // check for quoted string
    let chars = trimmed.toArray();
    if (chars[0] == '\"') {
      // find closing quote
      let inner = trimmed.split(#char '\"');
      let innerArr = inner.toArray();
      if (innerArr.size() >= 3) {
        ?innerArr[1];
      } else {
        null;
      };
    } else {
      // unquoted value — read until comma, space, or closing brace
      let endParts = trimmed.split(#predicate isValueTerminator);
      let endArr = endParts.toArray();
      if (endArr.size() > 0 and endArr[0].size() > 0) {
        ?endArr[0];
      } else {
        null;
      };
    };
  };
};
