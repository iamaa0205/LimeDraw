
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Random "mo:base/Random";
// import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";

actor LotteryContract {
  stable var lotteryOwner : Principal = Principal.fromText("aaaaa-aa");
  stable var users : [Principal] = [];
  stable var tickets : [Text] = [];
  stable var prizePool : Nat = 0;
  stable var ticketOwners : [(Text, Principal)] = [];
  stable var totalAvailableTickets : Nat = 0;
  stable var remainingTickets : Nat = 0;
  stable var ticketPrice : Nat = 0;
  stable var entryFee : Nat = 0;

  // Initialize the lottery
  public shared(msg) func init(
    _totalAvailableTickets: Nat,
    _ticketPrice: Nat,
    _entryFee: Nat
  ) : async () {
    if (msg.caller != lotteryOwner) {
    Debug.trap("Only the lottery owner can initialize");
  };
    totalAvailableTickets := _totalAvailableTickets;
    remainingTickets := _totalAvailableTickets;
    ticketPrice := _ticketPrice;
    entryFee := _entryFee;
  };

 
 

  // Function to get lottery status
  public query func getLotteryStatus() : async {
    totalTickets: Nat;
    remainingTickets: Nat;
    prizePool: Nat;
    ticketPrice: Nat;
    entryFee: Nat;
  } {
    {
      totalTickets = totalAvailableTickets;
      remainingTickets = remainingTickets;
      prizePool = prizePool;
      ticketPrice = ticketPrice;
      entryFee = entryFee;
    }
  };
  public shared(msg) func addUser() : async Text{

    // here first check weather user has enough balance or not to enter into lottery
    let caller = msg.caller;  
    users := Array.append(users, [caller]);
    return "User added to the lottery!";
  };
   public func getUsers() : async [Principal] {
        return users; 
  };
  public shared func generateUniqueTicketNumber() : async ?Nat {
    // Get some random bytes to generate randomness
    let randomBytes = await Random.blob();
    var randomGenerator = Random.Finite(randomBytes);

    // Filter available ticket numbers
    let availableNumbers = Array.filter<Nat>(
      Iter.toArray(Iter.range(1, totalAvailableTickets)),
      func(n: Nat) : Bool { 
        switch (Array.find<Text>(tickets, func(t) { t == Nat.toText(n) })) {
          case (null) { true }; // If the ticket number is not in use
          case (_) { false };   // If the ticket number is already in use
        }
      }
    );

    // Return null if no available numbers
    let availableSize = availableNumbers.size();
    if (availableSize == 0) {
      return null;
    };

    var randomIndex : ?Nat = null;
    label l loop {
      switch (randomGenerator.range(8)) {  // Use 8 bits for range
        case (?index) {
          if (index < availableSize) {
            randomIndex := ?index;
            break l;
          };
        };
        case (null) {
          // Entropy exhausted, get new randomness
          let newRandomBytes = await Random.blob();
          randomGenerator := Random.Finite(newRandomBytes);
        };
      };
    };

    switch (randomIndex) {
      case (?index) {
        return ?availableNumbers[index];
      };
      case (null) {
        return null;
      };
    };
  };

 
    

  public shared(msg) func buyTickets():async Text{
    let caller=msg.caller;
    let userExists = Array.find<Principal>(users, func (p) { Principal.equal(p, caller) });
    switch (userExists) {
      case (null) {
        return "Please join the lottery first";
      };
      case (?_) {
        let ticketNumberResult = await generateUniqueTicketNumber();
        
        switch (ticketNumberResult) {
          case (?ticketNumber) {
            let ticketId = Nat.toText(ticketNumber);
            tickets := Array.append(tickets, [ticketId]);
            ticketOwners := Array.append(ticketOwners, [(ticketId, caller)]);
            return "Ticket " # ticketId # " bought successfully";
          };
          case (null) {
            return "Failed to generate a unique ticket number. Please try again.";
          };
        };
      };
    };

  };
 
}


