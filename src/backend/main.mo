import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Common "types/common";
import UserTypes "types/users";
import VideoTypes "types/videos";
import ScriptTypes "types/scripts";
import UsersMixin "mixins/users-api";
import VideosMixin "mixins/videos-api";
import SubscriptionsMixin "mixins/subscriptions-api";
import ScriptsMixin "mixins/scripts-api";
import BrandKitMixin "mixins/brandkit-api";
import SharingMixin "mixins/sharing-api";
import AnalyticsMixin "mixins/analytics-api";
import YouTubeMixin "mixins/youtube-api";
import ScriptsLib "lib/scripts";





actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Object storage
  include MixinObjectStorage();

  // User profiles
  let userProfiles = Map.empty<Common.UserId, UserTypes.UserProfile>();
  include UsersMixin(accessControlState, userProfiles);

  // Video jobs
  let videoJobs = Map.empty<Common.VideoJobId, VideoTypes.VideoJob>();
  let nextJobId = { var value : Common.VideoJobId = 0 };

  // AI keys (admin-configured)
  let openAiKey = { var value = "" };
  let replicateKey = { var value = "" };

  include VideosMixin(
    accessControlState,
    userProfiles,
    videoJobs,
    nextJobId,
    openAiKey,
    replicateKey,
  );

  // Stripe / subscriptions
  let stripeConfig : { var value : ?Stripe.StripeConfiguration } = { var value = null };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  include SubscriptionsMixin(
    accessControlState,
    userProfiles,
    stripeConfig,
    transform,
  );

  // Script library
  let savedScripts = Map.empty<ScriptTypes.ScriptId, ScriptTypes.SavedScript>();
  let nextScriptId : ScriptsLib.NextIdRef = { var value : ScriptTypes.ScriptId = 0 };
  include ScriptsMixin(accessControlState, savedScripts, nextScriptId);

  // Brand kit (stored on UserProfile via userProfiles map)
  include BrandKitMixin(accessControlState, userProfiles);

  // Social sharing — token index maps share token → videoJobId
  let shareTokenIndex = Map.empty<Text, Common.VideoJobId>();
  include SharingMixin(accessControlState, userProfiles, videoJobs, shareTokenIndex);

  // Video analytics (uses same videoJobs map)
  include AnalyticsMixin(accessControlState, videoJobs);

  // YouTube OAuth credentials (admin-configured)
  let youtubeClientId = { var value = "" };
  let youtubeClientSecret = { var value = "" };

  // YouTube publishing
  include YouTubeMixin(accessControlState, userProfiles, videoJobs, youtubeClientId, youtubeClientSecret, transform);

  // Stripe platform-required functions (must be in actor, not mixin)
  public query func isStripeConfigured() : async Bool {
    stripeConfig.value != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig.value := ?config;
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let config = switch (stripeConfig.value) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?c) { c };
    };
    await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transform);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    let config = switch (stripeConfig.value) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?c) { c };
    };
    await Stripe.getSessionStatus(config, sessionId, transform);
  };
};
