import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";
import Common "../types/common";
import UserTypes "../types/users";
import BrandKitTypes "../types/brandkit";
import BrandKitLib "../lib/brandkit";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
) {
  public shared ({ caller }) func saveBrandKit(
    kit : BrandKitTypes.BrandKit
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    BrandKitLib.saveBrandKit(userProfiles, caller, kit);
  };

  public query ({ caller }) func getBrandKit() : async ?BrandKitTypes.BrandKit {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    BrandKitLib.getBrandKit(userProfiles, caller);
  };
};
