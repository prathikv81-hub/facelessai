import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Common "../types/common";
import UserTypes "../types/users";
import BrandKitTypes "../types/brandkit";

module {
  public func saveBrandKit(
    userProfiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
    userId : Common.UserId,
    kit : BrandKitTypes.BrandKit,
  ) : () {
    switch (userProfiles.get(userId)) {
      case (?profile) {
        profile.brandKit := ?kit;
        profile.updatedAt := Time.now();
      };
      case null {
        Runtime.trap("User profile not found");
      };
    };
  };

  public func getBrandKit(
    userProfiles : Map.Map<Common.UserId, UserTypes.UserProfile>,
    userId : Common.UserId,
  ) : ?BrandKitTypes.BrandKit {
    switch (userProfiles.get(userId)) {
      case (?profile) { profile.brandKit };
      case null { null };
    };
  };
};
