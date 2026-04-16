import Common "common";

module {
  public type ScriptId = Nat;

  public type SavedScript = {
    id : ScriptId;
    userId : Common.UserId;
    title : Text;
    content : Text;
    createdAt : Common.Timestamp;
  };
};
