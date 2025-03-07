import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Hash "mo:base/Hash";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Random "mo:base/Random";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
// import Prelude "mo:base/Prelude";
// import Set "mo:base/HashSet";
// import map "mo:base/HashMap";
import Blob "mo:base/Blob";
// import Canister "mo:basec/Canister";

actor LotteryContract {

  // Mapping for ContextId1 to ContextId2
  let Context1to2 : HashMap.HashMap<Text, Text> = HashMap.HashMap<Text, Text>(16, Text.equal, Text.hash);
  // Mapping for ContextId2 to ContextId1
  let Context2to1 : HashMap.HashMap<Text, Text> = HashMap.HashMap<Text, Text>(16, Text.equal, Text.hash);
  // Mapping to check if winner is declared
  let WinnerMap : HashMap.HashMap<Text, Bool> = HashMap.HashMap<Text, Bool>(16, Text.equal, Text.hash);
  // Mapping from ContextId1 to ticketNumber to calimeroPubKey
  let outerMap : HashMap.HashMap<Text, HashMap.HashMap<Nat, Text>> = HashMap.HashMap<Text, HashMap.HashMap<Nat, Text>>(16, Text.equal, Text.hash);
  // Mapping to store the Number of tickets wrt a ContextId
  let noTicket : HashMap.HashMap<Text, Nat> = HashMap.HashMap<Text, Nat>(16, Text.equal, Text.hash);
  // Mapping to store the available tickets
  let availableTicket : HashMap.HashMap<Text, HashMap.HashMap<Nat, Bool>> = HashMap.HashMap<Text, HashMap.HashMap<Nat, Bool>>(16, Text.equal, Text.hash);
  // Mapping to store the available no of tickets rn
  let availableNoTicket : HashMap.HashMap<Text, Nat> = HashMap.HashMap<Text, Nat>(16, Text.equal, Text.hash);
  // Tickets Array for a lottery which is shuffled based on randomness
  let ticketsAvailable : HashMap.HashMap<Text, [var Nat]> = HashMap.HashMap<Text, [var Nat]>(16, Text.equal, Text.hash);
  // Mapping from ContextId1 to calimeroPubKey to ticketNumber
  let contextToPubKeyToTicket : HashMap.HashMap<Text, HashMap.HashMap<Text, Nat>> = HashMap.HashMap<Text, HashMap.HashMap<Text, Nat>>(16, Text.equal, Text.hash);
  // private var publicKey : Blob = Blob.fromArray([]);
  let contextToPrincipalMap : HashMap.HashMap<Text, Principal> = HashMap.HashMap<Text, Principal>(16, Text.equal, Text.hash);
  // Store the Winner Here
  let storeWinner : HashMap.HashMap<Text, Nat> = HashMap.HashMap<Text, Nat>(16, Text.equal, Text.hash);
  // let Winner
  // private var publicKey : Principal = Principal.fromText("2vxsx-fae");
  var seed : Nat = 0;

  // testing vars
  var callNumber : Nat = 0;
  var test1 : Text = "";
  var test2 : Text = "";
  var blo : Blob = "";
  var test3 : Principal = Principal.fromText("2vxsx-fae");

  // init function called to initialize the state of the Lottery Manager Contract
  public func init() : async () {};

  func customNatHash(n : Nat) : Nat32 {
    var x = n;
    var h : Nat64 = 0; // Use Nat64 for intermediate calculations
    while (x > 0) {
      h := h +% Nat64.fromNat(x % 256);
      h := h *% 2862933555777941757;
      x := x / 256;
    };
    Nat32.fromNat(Nat64.toNat(h % 0x100000000)) // Convert back to Nat32
  };

  public func addLottery(num : Nat, t1 : Text, t2 : Text, _pubKey : Text) : async () {
    switch (Context1to2.get(t1)) {
      case (null) {
        let _ = await set1to2(t1, t2);
        let _ = await set2to1(t2, t1);
        WinnerMap.put(t1, false);
        let _ = await setNoTicket(t1, num);
        let _ = await setContextToPrincipal(t1, Principal.fromText(_pubKey));
        availableNoTicket.put(t1, num);
        // publicKey := Principal.fromText(_pubKey);
        let innerMap = HashMap.HashMap<Nat, Bool>(num, Nat.equal, customNatHash);

        for (i in Iter.range(1, num)) {
          innerMap.put(i, false);
        };

        availableTicket.put(t1, innerMap);
        let array = Array.tabulateVar<Nat>(num, func(i) { i + 1 });
        ticketsAvailable.put(t1, array);
      };
      // let availableNumbers = Array.tabulate<Nat>(num, func(i) { i + 1 });
      // availableTicket.put(t1, availableNumbers);
      case (?_) {
        throw Error.reject("Lottery Already Initialized!");
      };
    };
  };

  // Set the ContextId2 ta a key ContextId1
  private func set1to2(k : Text, v : Text) : async ?Text {
    if (k == "") {
      throw Error.reject("Empty string is not a valid key");
    };
    return Context1to2.replace(k, v);
  };

  // Set the ContextId1 ta a key ContextId2
  private func set2to1(k : Text, v : Text) : async ?Text {
    if (k == "") {
      throw Error.reject("Empty string is not a valid key");
    };
    return Context2to1.replace(k, v);
  };

  // Set if the Winner has already been declared
  public shared (msg) func setWinnerDeclared(input : Blob) : async (?Nat) {

    let (_, key) = await extractStrings(input);
    // Check for equality of the proxy contract to allot the random number
    let callerkey : Principal = msg.caller;
    try {
      await checkPublicKey(callerkey, key);
      // Public key matches
    } catch (error) {
      // Handle the error
      Debug.print("Error: " # Error.message(error));
    };
    let num = await randomNumberGenerator2(key);
    WinnerMap.put(key, true);
    storeWinner.put(key, num);
    return ?num;
  };

  // Function to set the context id to a principal
  private func setContextToPrincipal(key : Text, value : Principal) : async () {
    contextToPrincipalMap.put(key, value);
  };

  // Function to Buy tickets
  public shared (msg) func buyTicket(input : Blob) : async () {
    // Check if the lottery is active
    let (key, contextId) = await extractStrings(input);

    var princ = switch (contextToPrincipalMap.get(contextId)) {
      case (null) {
        Principal.fromText("2vxsx-fae");
      };
      case (?val) {
        val;
      };
    };
    test1 := key;
    test2 := contextId;
    test3 := princ;

    // test3 := switch (await getPrincipal(key)) {
    //   case (null) {
    //     Principal.fromText("2vxsx-fae");
    //   };
    //   case (?val) {
    //     val;
    //   };
    // };
    // switch (WinnerMap.get(contextId)) {
    //   case (null) {

    //   };
    //   case (?value) {
    //     if (value) {
    //       throw Error.reject("Winner already declared");
    //     };
    //   };
    // };

    // Check for equality of the proxy contract to allot the random number
    let callerkey : Principal = msg.caller;
    try {
      await checkPublicKey(callerkey, contextId);
      // Public key matches
    } catch (error) {
      // Handle the error
      Debug.print("Error: " # Error.message(error));
    };
    var innerKey : Nat = await randomNumberGenerator(contextId);
    let _ = await setTicketNoToPub(contextId, innerKey, key);
    let _ = await setcontextToPubKeyToTicket(contextId, key, innerKey);
  };

  public func extractStrings(inputBlob : Blob) : async (Text, Text) {
    let bytes = Blob.toArray(inputBlob);
    let totalLength = bytes.size();

    if (totalLength < 388) {
      // 344 + 44
      return ("Error: Input blob is too short", "");
    };

    let lastIndex = totalLength - 1;
    let last256 = Array.tabulate<Nat8>(344, func(i) { bytes[lastIndex - 343 + i] });
    let next27 = Array.tabulate<Nat8>(44, func(i) { bytes[lastIndex - 387 + i] });

    let last256String = switch (Text.decodeUtf8(Blob.fromArray(last256))) {
      case (null) { "Error: Invalid UTF-8 in last 256 bytes" };
      case (?text) { text };
    };

    let next27String = switch (Text.decodeUtf8(Blob.fromArray(next27))) {
      case (null) { "Error: Invalid UTF-8 in next 27 bytes" };
      case (?text) { text };
    };

    (last256String, next27String);
  };

  // Set the Ticket Number alloted to the Calimero-Pub-Key wrt to a ContextId
  private func setTicketNoToPub(outerKey : Text, innerKey : Nat, value : Text) : async () {

    switch (outerMap.get(outerKey)) {
      case (null) {
        let innerMap = HashMap.HashMap<Nat, Text>(16, Nat.equal, Hash.hash);
        innerMap.put(innerKey, value);
        outerMap.put(outerKey, innerMap);
      };
      case (?innerMap) {
        innerMap.put(innerKey, value);
      };
    };
  };

  // Function for ease
  private func setcontextToPubKeyToTicket(outerKey : Text, innerKey : Text, value : Nat) : async () {
    switch (contextToPubKeyToTicket.get(outerKey)) {
      case (null) {
        let innerMap = HashMap.HashMap<Text, Nat>(16, Text.equal, Text.hash);
        innerMap.put(innerKey, value);
        contextToPubKeyToTicket.put(outerKey, innerMap);
      };
      case (?innerMap) {
        innerMap.put(innerKey, value);
        contextToPubKeyToTicket.put(outerKey, innerMap); // Ensure it's updated after the change
      };
    };
  };

  // Function to check the equality of the proxy contract
  public func checkPublicKey(callerkey : Principal, key : Text) : async () {
    // let callerPrincipal : Principal = msg.caller;
    // let derivedPrincipal = Principal.fromBlob(publicKey);
    var princ = switch (contextToPrincipalMap.get(key)) {
      case (null) {
        Principal.fromText("2vxsx-fae");
      };
      case (?val) {
        val;
      };
    };
    var publicKey = princ;
    // var publicKey : Principal = switch (await getPrincipal(key)) {
    //   case (null) {
    //     // Handle the case where the key is null, maybe assign a default value or throw an error
    //     throw Error.reject("Principal not found");
    //   };
    //   case (?val) {
    //     // Assign the value from the result to publicKey
    //     val; // This will automatically return the principal (val) from the case
    //   };
    // };

    if (not Principal.equal(callerkey, publicKey)) {
      throw Error.reject("Caller's principal does not match the stored public key " #Principal.toText(callerkey));
    };
    // If we reach here, the principals match
  };

  // Set the number of tickets corresponding to a ContextId
  private func setNoTicket(k : Text, _noTicket : Nat) : async () {
    return noTicket.put(k, _noTicket);
  };

  // Give A random number
  private func randomNumberGenerator(key : Text) : async Nat {
    var result : Nat = 0;
    let blob = await Random.blob();
    seed := Random.rangeFrom(32, blob);
    let maxValue : Nat = switch (availableNoTicket.get(key)) {
      case (null) {
        throw Error.reject("No tickets available for the given key");
      };
      case (?val) val;
    };
    let randomNumber = (seed % maxValue);
    // let innerMapOpt1 = availableTicket.get(key);
    // let innerMap : HashMap.HashMap<Nat, Bool> = switch (innerMapOpt1) {
    //   case (?map){
    //     map.put(randomNumber,true);
    //     availableTicket.put(key,map);
    //   } ;
    //   case (null) throw Error.reject("Key not found in availableTicket map");
    // };

    let innerMapOpt = ticketsAvailable.get(key);
    switch (innerMapOpt) {
      case (?array) {
        result := switch (array[randomNumber]) {
          case (val) {
            val;
          };
        };
        let temp = array[maxValue - 1];
        array[maxValue - 1] := array[randomNumber];
        array[randomNumber] := temp;
      };
      case (null) {
        Debug.print("Error");
      };
    };

    availableNoTicket.put(key, maxValue - 1);
    return result;
  };

  private func randomNumberGenerator2(key : Text) : async Nat {
    var result : Nat = 0;
    let blob = await Random.blob();
    seed := Random.rangeFrom(32, blob);
    let maxValue : Nat = switch (availableNoTicket.get(key)) {
      case (null) {
        throw Error.reject("No tickets available for the given key");
      };
      case (?val) val;
    };
    let total : Nat = switch (noTicket.get(key)) {
      case (null) {
        throw Error.reject("No tickets available for the given key");
      };
      case (?val) val;
    };

    let randomNumber = maxValue + (seed % (total - maxValue));

    let innerMapOpt = ticketsAvailable.get(key);
    switch (innerMapOpt) {
      case (?array) {
        result := switch (array[randomNumber]) {
          case (val) {
            val;
          };
        };
      };
      case (null) {
        Debug.print("Error");
      };
    };
    return result;
  };

  // Getter function to get the ContextId1 corresponding to ContextId2
  public query func get2to1(k : Text) : async ?Text {
    return Context2to1.get(k);
  };

  // Getter function to get the ContextId2 corresponding to ContextId1
  public query func get1to2(k : Text) : async ?Text {
    return Context1to2.get(k);
  };

  // Check if the Winner has been declared
  public query func checkWinnerDeclared(key : Text) : async ?Bool {
    WinnerMap.get(key);
  };

  // Get the public key corresponding to a ticket number
  public query func getPubKey(outerKey : Text, innerKey : Nat) : async ?Text {
    switch (outerMap.get(outerKey)) {
      case (null) null;
      case (?innerMap) innerMap.get(innerKey);
    };
  };

  // Get the Number of Tickets corresponding to a Context Id
  public query func getNoTicket(k : Text) : async Nat {
    return switch (noTicket.get(k)) {
      case (null) { 0 };
      case (?val) { val };
    };
  };

  // Get the winning ticket corresponding to a contextId
  public query func getWinningTicket(k : Text) : async ?Nat {
    return storeWinner.get(k);
  };

  public query func getcontextToPubKeyToTicket(outerKey : Text, innerKey : Text) : async ?Nat {
    switch (contextToPubKeyToTicket.get(outerKey)) {
      case (null) { null };
      case (?innerMap) { innerMap.get(innerKey) };
    };
  };

  public query func getPrincipal(key : Text) : async ?Principal {
    contextToPrincipalMap.get(key);
  };

  public query func getAvailableNoTicket(key : Text) : async Nat {
    return switch (availableNoTicket.get(key)) {
      case (null) { 0 };
      case (?val) { val };
    };
  };

  // Get the number of unique players in the lottery
  public func getUniqueUsers(contextId : Text) : async Nat {
    switch (outerMap.get(contextId)) {
      case (?innerMap) {
        var uniqueUsers : [Text] = [];

        // Get max ticket index to iterate properly
        let maxTicketIndex = (await getNoTicket(contextId));

        for (ticketIndex in Iter.range(1, maxTicketIndex)) {
          switch (innerMap.get(ticketIndex)) {
            case (?userId) {
              if (Array.find<Text>(uniqueUsers, func(u) { u == userId }) == null) {
                uniqueUsers := Array.append<Text>(uniqueUsers, [userId]);
              };
            };
            case null {}; // Ignore missing ticket numbers
          };
        };
        return Array.size(uniqueUsers);
      };
      case (null) { return 0 };
    };
  };

  // testing func
  // public func gf() : async () {
  //   callNumber := callNumber + 1;
  // };
  // public func gf1(input : Blob) : async () {
  //   let (first, second) = await extractStrings(input);
  //   test1 := first;
  //   test2 := second;
  // };
  // public func gf2(input : Blob) : async () {
  //   blo := input;
  // };
  // public func printgf2() : async Blob {
  //   return blo;
  // };
  // public query func test() : async Nat {
  //   return callNumber;
  // };
  // public query func test12() : async Text {
  //   return test1;
  // };
  // public query func test13() : async Text {
  //   return test2;
  // };
  // public query func test14() : async Principal {
  //   return test3;
  // };

};
