import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Common "../types/common";
import ScriptTypes "../types/scripts";

module {
  public type ScriptsMap = Map.Map<ScriptTypes.ScriptId, ScriptTypes.SavedScript>;
  public type NextIdRef = { var value : ScriptTypes.ScriptId };

  public func saveScript(
    scripts : ScriptsMap,
    nextId : NextIdRef,
    userId : Common.UserId,
    title : Text,
    content : Text,
  ) : ScriptTypes.SavedScript {
    let id = nextId.value;
    nextId.value := id + 1;
    let script : ScriptTypes.SavedScript = {
      id;
      userId;
      title;
      content;
      createdAt = Time.now();
    };
    scripts.add(id, script);
    script;
  };

  public func listScripts(
    scripts : ScriptsMap,
    userId : Common.UserId,
  ) : [ScriptTypes.SavedScript] {
    let results = List.empty<ScriptTypes.SavedScript>();
    for ((_, script) in scripts.entries()) {
      if (Principal.equal(script.userId, userId)) {
        results.add(script);
      };
    };
    results.toArray();
  };

  public func getScript(
    scripts : ScriptsMap,
    userId : Common.UserId,
    id : ScriptTypes.ScriptId,
  ) : ?ScriptTypes.SavedScript {
    switch (scripts.get(id)) {
      case (?script) {
        if (Principal.equal(script.userId, userId)) { ?script } else { null };
      };
      case null { null };
    };
  };

  public func deleteScript(
    scripts : ScriptsMap,
    userId : Common.UserId,
    id : ScriptTypes.ScriptId,
  ) : Bool {
    switch (scripts.get(id)) {
      case (?script) {
        if (Principal.equal(script.userId, userId)) {
          scripts.remove(id);
          true;
        } else {
          false;
        };
      };
      case null { false };
    };
  };
};
