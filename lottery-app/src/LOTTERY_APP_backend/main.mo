import IC "ic:aaaaa-aa";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Random "mo:base/Random";
// import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Blob "mo:base/Blob";
import IcpLedger "canister:icp_ledger_canister";
import Nat64 "mo:base/Nat64";
import Error "mo:base/Error";


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
    lotteryOwner:=msg.caller;
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
 private func getRandomNumber(max : Nat) : async Nat {
  let raw_rand = await IC.raw_rand();
  let random_bytes = Blob.toArray(raw_rand);
  if (random_bytes.size() > 0) {
    let random_byte = random_bytes[0];
    return Nat8.toNat(random_byte) % max;
  } else {
    return 0; // Fallback value if no random bytes are returned
  }
};
public shared func guessWinner() : async Principal {
  let winningIndex = await getRandomNumber(tickets.size());
  let winningTicket = tickets[winningIndex];
  let winner = Array.find<(Text, Principal)>(ticketOwners, func((id, _)) { id == winningTicket });
  
  switch (winner) {
    case (?(_, winnerPrincipal)) { winnerPrincipal };
    case (null) { Principal.fromText("") }; // This should never happen if ticketOwners is correctly maintained
  }
};
public shared(msg) func givePrize(recipientPublicKey: Text) : async Text {
  if (msg.caller != lotteryOwner) {
    return "Only the lottery owner can distribute the prize";
  };

  let recipientPrincipal = Principal.fromText(recipientPublicKey);
  let transferArgs : IcpLedger.TransferArgs = {
    memo = 0;
   amount = { e8s = Nat64.fromNat(prizePool) };  // Convert Nat to Nat64
    fee = { e8s = Nat64.fromNat(10_000) };       // Convert fee to Nat64
    from_subaccount = null;
    to = Principal.toLedgerAccount(recipientPrincipal, null);
    created_at_time = null;
  };

  try {
    let transferResult = await IcpLedger.transfer(transferArgs);
    switch (transferResult) {
      case (#Err(transferError)) {
        return "Couldn't transfer funds: " # debug_show(transferError);
      };
      case (#Ok(blockIndex)) { 
        prizePool := 0;
        return "Prize of " # debug_show(transferArgs.amount) # " e8s ICP transferred successfully. Block index: " # debug_show(blockIndex);
      };
    };
  } catch (error : Error) {
    return "Reject message: " # Error.message(error);
  };
};
 
}


