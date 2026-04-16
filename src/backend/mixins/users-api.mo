import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Types "../types/users";
import UserLib "../lib/users";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Common.UserId, Types.UserProfile>,
) {
  public query ({ caller }) func getCallerProfile() : async ?Types.UserProfilePublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (userProfiles.get(caller)) {
      case (?p) { ?p.toPublic() };
      case null { null };
    };
  };

  public shared ({ caller }) func saveCallerProfile(displayName : Text, email : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (userProfiles.get(caller)) {
      case (?existing) {
        existing.displayName := displayName;
        existing.email := email;
      };
      case null {
        let profile = UserLib.new(caller, displayName, email);
        userProfiles.add(caller, profile);
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?Types.UserProfilePublic {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (userProfiles.get(user)) {
      case (?p) { ?p.toPublic() };
      case null { null };
    };
  };

  public query ({ caller }) func getCreditBalance() : async Common.CreditsAmount {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (userProfiles.get(caller)) {
      case (?p) { p.creditBalance };
      case null { 0 };
    };
  };

  public shared ({ caller }) func addCredits(user : Principal, amount : Common.CreditsAmount) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add credits");
    };
    let profile = switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?p) { p };
    };
    profile.creditBalance := profile.creditBalance + amount;
  };

  public shared ({ caller }) func setSubscription(
    user : Principal,
    subscription : Types.Subscription,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set subscriptions");
    };
    let profile = switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?p) { p };
    };
    UserLib.setSubscription(profile, subscription);
  };
};
