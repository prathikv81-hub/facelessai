import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";
import Common "../types/common";
import ScriptTypes "../types/scripts";
import ScriptsLib "../lib/scripts";

mixin (
  accessControlState : AccessControl.AccessControlState,
  scripts : ScriptsLib.ScriptsMap,
  nextScriptId : ScriptsLib.NextIdRef,
) {
  public shared ({ caller }) func saveScript(
    title : Text,
    content : Text,
  ) : async ScriptTypes.SavedScript {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ScriptsLib.saveScript(scripts, nextScriptId, caller, title, content);
  };

  public query ({ caller }) func listScripts() : async [ScriptTypes.SavedScript] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ScriptsLib.listScripts(scripts, caller);
  };

  public query ({ caller }) func getScript(
    id : ScriptTypes.ScriptId
  ) : async ?ScriptTypes.SavedScript {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ScriptsLib.getScript(scripts, caller, id);
  };

  public shared ({ caller }) func deleteScript(
    id : ScriptTypes.ScriptId
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let _ = ScriptsLib.deleteScript(scripts, caller, id);
  };
};
