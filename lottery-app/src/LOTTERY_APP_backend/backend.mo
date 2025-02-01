import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";
import Blob "mo:base/Blob";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Random "mo:base/Random";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Prelude "mo:base/Prelude";
import Int "mo:base/Int";
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
  //Mapping to store the available tickets
  let availableTicket : HashMap.HashMap<Text, [Int]> = HashMap.HashMap<Text, [Int]>(16, Text.equal, Text.hash);
  private var publicKey : Blob = Blob.fromArray([]);
  var seed : Nat = 0;

  // init function called to initialize the state of the Lottery Manager Contract
  public func init() : async () {};

  public func addLottery(num : Nat, t1 : Text, t2 : Text, _pubKey : Blob) : async () {
    switch (Context1to2.get(t1)) {
      case (null) {
        let res1 = await set1to2(t1, t2);
        let res2 = await set2to1(t2, t1);
        // maybe initialize the winner as false
        let res4 = await setNoTicket(t1, num);
        publicKey := _pubKey;
        let availableNumbers = Array.tabulate<Nat>(num, func(i) { i + 1 });
        availableTicket.put(t1, availableNumbers);
      };
      case (?val) {
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
  public func setWinnerDeclared(key : Text) : async () {
    // Check for equality of the proxy contract to allot the random number
    try {
      await checkPublicKey();
      // Public key matches
    } catch (error) {
      // Handle the error
      Debug.print("Error: " # Error.message(error));
    };
    WinnerMap.put(key, true);
  };

  // Function to Buy tickets
  public func buyTicket(contextId : Text, key : Text) : async () {
    // Check if the lottery is active
    switch (WinnerMap.get(contextId)) {
      case (null) {

      };
      case (?value) {
        if (value) {
          throw Error.reject("Winner already declared");
        };
      };
    };

    // Check for equality of the proxy contract to allot the random number
    try {
      await checkPublicKey();
      // Public key matches
    } catch (error) {
      // Handle the error
      Debug.print("Error: " # Error.message(error));
    };
    var innerKey : Nat = await randomNumberGenerator(contextId);
    let res = await setTicketNoToPub(contextId, innerKey, key);
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

  // Function to check the equality of the proxy contract
  public shared (msg) func checkPublicKey() : async () {
    let callerPrincipal = msg.caller;
    let derivedPrincipal = Principal.fromBlob(publicKey);

    if (callerPrincipal != derivedPrincipal) {
      throw Error.reject("Caller's principal does not match the stored public key");
    };
    // If we reach here, the principals match
  };

  // Set the number of tickets corresponding to a ContextId
  private func setNoTicket(k : Text, _noTicket : Nat) : async () {
    return noTicket.put(k, _noTicket);
  };

  // Give A random number
  private func randomNumberGenerator(key : Text) : async Nat {
    var availableNumbers : [var Int] = switch (availableTicket.get(key)) {
      case (null) {
        throw Error.reject("Key not found in availableTicket");
      };
      case (?value) {
        Array.init<Int>(value.size(), func(i : Nat) : Int { value[i] });
      };
    };
    var size : Int = availableNumbers.size();
    if (size == 0) {
      throw Error.reject("No available numbers");
    };

    // Generate a random index
    let blob = await Random.blob();
    let seed = Random.rangeFrom(32, blob);
    let randomIndex = seed % size;

    // Get the number at the random index
    let selectedNumber = availableNumbers[Int.abs(randomIndex)];

    // Remove the number by shifting all subsequent elements
    for (i in Iter.range(Int.abs(randomIndex), size - 2)) {
      availableNumbers[i] := availableNumbers[i + 1];
    };

    // Shrink the array
    let tempNumbers = Array.init<Int>(Int.abs(size) - 1, 0);
    for (i in Iter.range(0, size - 2)) {
      tempNumbers[i] := availableNumbers[i];
    };
    availableTicket.put(key, tempNumbers);
    Debug.print("Selected number: " # debug_show (selectedNumber));

    return Int.abs(selectedNumber);
  };
  //   return 1;

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
  public query func getNoTicket(k : Text) : async ?Nat {
    return noTicket.get(k);
  };

  // Get the remaining numbers
  public func getRemainingNumbers(key : Text, count : Nat) : async [Nat] {
    switch (availableTicket.get(key)) {
      case (null) {
        Debug.print("Key not found in map");
        [];
      };
      case (?array) {
        let size = array.size();
        if (count >= size) {
          Debug.print("Count is greater than or equal to array size");
          [];
        } else {
          Array.tabulate<Nat>(size - count, func(i) { array[i + count] });
        };
      };
    };
  };
};
