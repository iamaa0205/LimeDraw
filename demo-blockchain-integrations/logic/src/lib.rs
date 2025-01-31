use calimero_sdk::borsh::{BorshDeserialize, BorshSerialize};
use calimero_sdk::env::ext::{AccountId, ProposalId};
use calimero_sdk::serde::{Deserialize, Serialize};
use calimero_sdk::types::Error;
use calimero_sdk::{app, env};
use calimero_storage::collections::{UnorderedMap, Vector};
use serde_json::Number;

#[app::state(emits = Event)]
#[derive(Debug, PartialEq, PartialOrd, BorshSerialize, BorshDeserialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct AppState {
    messages: UnorderedMap<ProposalId, Vector<Message>>,
    players: Vec<Player>,
    lottery_state: LotteryState,
    ticket_owner: UnorderedMap<u32, String>,
    calimero_public_key_onwer: UnorderedMap<String, Player>,
    counter: Counter,
}

#[derive(
    Clone, Debug, PartialEq, PartialOrd, BorshSerialize, BorshDeserialize, Serialize, Deserialize,
)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub struct Message {
    id: String,
    proposal_id: String,
    author: String,
    text: String,
    created_at: String,
}
#[derive(
    Clone, Debug, PartialEq, PartialOrd, BorshSerialize, BorshDeserialize, Serialize, Deserialize,
)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub struct Counter {
    value: u32,
}

#[derive(
    Clone, Debug, PartialEq, PartialOrd, BorshSerialize, BorshDeserialize, Serialize, Deserialize,
)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub struct Player {
    name: String,
    calimero_public_key: String,
    role: u32, 
}

#[derive(
    Clone, Debug, PartialEq, PartialOrd, BorshSerialize, BorshDeserialize, Serialize, Deserialize,
)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub struct LotteryState {
    name: String,
    description: String,
    ticket_price: u128,
    ticket_count: u128,
    remaining_tickets: u128,
    prize_pool: u128,
    owner: Option<Player>,
    winner: Option<Player>,
}

#[app::event]
pub enum Event {
    ProposalCreated { id: ProposalId },
    ApprovedProposal { id: ProposalId },
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "calimero_sdk::serde")]
pub struct CreateProposalRequest {
    pub action_type: String,
    pub params: serde_json::Value,
}

#[app::logic]
impl AppState {
    #[app::init]
    pub fn init() -> AppState {
        AppState {
            messages: UnorderedMap::new(),
            players: Vec::new(),
            lottery_state: LotteryState {
                name: "".to_string(),
                description: "".to_string(),
                ticket_price: 0,
                ticket_count: 0,
                remaining_tickets: 0,
                prize_pool: 0,
                owner: None,
                winner: None,
            },
            ticket_owner: UnorderedMap::new(),
            calimero_public_key_onwer: UnorderedMap::new(),
            counter: Counter { value: 0 },
        }
    }
    pub fn increment_counter(&mut self) {
        self.counter.value += 1;
        env::log(&format!("Counter incremented: {}", self.counter.value));
    }
    pub fn get_counter(&self) -> Result<u32, Error> {
        env::log(&format!(
            "📤 Returning counter value: {}",
            self.counter.value
        ));
        Ok(self.counter.value)
    }
    pub fn create_player(&mut self, calimero_public_key: String, name: String) -> Result<(), Error> {
        // Debug log to check function call
        env::log(&format!(
            "📥 Creating new player: name={}, calimero_public_key={}",
            name, calimero_public_key
        ));
    
        // Check if the public key is already associated with a player
        if self.calimero_public_key_onwer.get(&calimero_public_key)?.is_some() {
            env::log("❌ Error: Player with this Calimero public key already exists");
            return Err(Error::msg("Player with this Calimero public key already exists"));
        }
    
        // Create a new player with default role (assuming 0 is the default for a player)
        let new_player = Player {
            name: name.clone(),
            calimero_public_key: calimero_public_key.clone(),
            role: 0, // Default role
        };
    
        // Add player to the players array
        self.players.push(new_player.clone());
    
        // Add player to calimero_public_key_onwer map
        self.calimero_public_key_onwer.insert(calimero_public_key, new_player)?;
    
        env::log("✅ Player successfully created!");
        Ok(())
    }
    pub fn get_all_players(&self) -> Result<Vec<Player>, Error> {
        env::log("📤 Fetching all players");
    
        // Check if there are any players
        if self.players.is_empty() {
            env::log("ℹ️ No players found.");
            return Ok(vec![]);
        }
    
        Ok(self.players.clone()) // Return a clone of the players array
    }


    
    pub fn create_lottery(
        &mut self,
        name: String,
        description: String,
        ticket_price: u128,
        ticket_count: u128,
        prize_pool: u128,
        calimero_public_key: String,
    ) -> Result<(), Error> {
        // Debug log to check function call
        env::log(&format!(
            "📥 Creating a new lottery: name={}, description={}, ticket_price={}, ticket_count={}, prize_pool={}",
            name, description, ticket_price, ticket_count, prize_pool
        ));
    
        // Check if the player exists in the map using the Calimero public key
        let player = self.calimero_public_key_onwer.get(&calimero_public_key)?;
        if player.is_none() {
            env::log("❌ Error: No player found with the provided Calimero public key");
            return Err(Error::msg("No player found with the provided Calimero public key"));
        }
    
        // Get the player from the map
        let player = player.unwrap();
    
        // Create the new lottery with the provided parameters
        let new_lottery = LotteryState {
            name,
            description,
            ticket_price,
            ticket_count,
            remaining_tickets: ticket_count,
            prize_pool,
            owner: Some(player),  // Assign the owner
            winner: None,  // Set the winner to None initially
        };
    
        // Assign the new lottery to the state (you may want to store this lottery)
        self.lottery_state = new_lottery;
    
        env::log("✅ Lottery successfully created!");
        Ok(())
    }
    
    


    pub fn create_new_proposal(
        &mut self,
        request: CreateProposalRequest,
    ) -> Result<ProposalId, Error> {
        env::log("Starting create_new_proposal");
        env::log(&format!("Request type: {}", request.action_type));

        let proposal_id = match request.action_type.as_str() {
            "ExternalFunctionCall" => {
                env::log("Processing ExternalFunctionCall");
                let receiver_id = request.params["receiver_id"]
                    .as_str()
                    .ok_or_else(|| Error::msg("receiver_id is required"))?;
                let method_name = request.params["method_name"]
                    .as_str()
                    .ok_or_else(|| Error::msg("method_name is required"))?;
                let args = request.params["args"]
                    .as_str()
                    .ok_or_else(|| Error::msg("args is required"))?;
                let deposit = request.params["deposit"]
                    .as_str()
                    .ok_or_else(|| Error::msg("deposit is required"))?
                    .parse::<u128>()?;

                env::log(&format!(
                    "Parsed values: receiver_id={}, method_name={}, args={}, deposit={}",
                    receiver_id, method_name, args, deposit
                ));

                Self::external()
                    .propose()
                    .external_function_call(
                        receiver_id.to_string(),
                        method_name.to_string(),
                        args.to_string(),
                        deposit,
                    )
                    .send()
            }
            "Transfer" => {
                env::log("Processing Transfer");
                let receiver_id = request.params["receiver_id"]
                    .as_str()
                    .ok_or_else(|| Error::msg("receiver_id is required"))?;
                let amount = request.params["amount"]
                    .as_str()
                    .ok_or_else(|| Error::msg("amount is required"))?
                    .parse::<u128>()?;

                Self::external()
                    .propose()
                    .transfer(AccountId(receiver_id.to_string()), amount)
                    .send()
            }
            "SetContextValue" => {
                env::log("Processing SetContextValue");
                let key = request.params["key"]
                    .as_str()
                    .ok_or_else(|| Error::msg("key is required"))?
                    .as_bytes()
                    .to_vec()
                    .into_boxed_slice();
                let value = request.params["value"]
                    .as_str()
                    .ok_or_else(|| Error::msg("value is required"))?
                    .as_bytes()
                    .to_vec()
                    .into_boxed_slice();

                Self::external()
                    .propose()
                    .set_context_value(key, value)
                    .send()
            }
            "SetNumApprovals" => Self::external()
                .propose()
                .set_num_approvals(
                    request.params["num_approvals"]
                        .as_u64()
                        .ok_or(Error::msg("num_approvals is required"))? as u32,
                )
                .send(),
            "SetActiveProposalsLimit" => Self::external()
                .propose()
                .set_active_proposals_limit(
                    request.params["active_proposals_limit"]
                        .as_u64()
                        .ok_or(Error::msg("active_proposals_limit is required"))?
                        as u32,
                )
                .send(),
            "DeleteProposal" => Self::external()
                .propose()
                .delete(ProposalId(
                    hex::decode(
                        request.params["proposal_id"]
                            .as_str()
                            .ok_or_else(|| Error::msg("proposal_id is required"))?,
                    )?
                    .try_into()
                    .map_err(|_| Error::msg("Invalid proposal ID length"))?,
                ))
                .send(),
            _ => return Err(Error::msg("Invalid action type")),
        };

        env::emit(&Event::ProposalCreated { id: proposal_id });

        let old = self.messages.insert(proposal_id, Vector::new())?;
        if old.is_some() {
            return Err(Error::msg("proposal already exists"));
        }

        Ok(proposal_id)
    }

    pub fn approve_proposal(&self, proposal_id: ProposalId) -> Result<(), Error> {
        // fixme: should we need to check this?
        // self.messages
        //     .get(&proposal_id)?
        //     .ok_or(Error::msg("proposal not found"))?;

        Self::external().approve(proposal_id);

        env::emit(&Event::ApprovedProposal { id: proposal_id });

        Ok(())
    }

    pub fn get_proposal_messages(&self, proposal_id: ProposalId) -> Result<Vec<Message>, Error> {
        let Some(msgs) = self.messages.get(&proposal_id)? else {
            return Ok(vec![]);
        };

        let entries = msgs.entries()?;

        Ok(entries.collect())
    }

    pub fn send_proposal_messages(
        &mut self,
        proposal_id: ProposalId,
        message: Message,
    ) -> Result<(), Error> {
        let mut messages = self.messages.get(&proposal_id)?.unwrap_or_default();

        messages.push(message)?;

        self.messages.insert(proposal_id, messages)?;

        Ok(())
    }
}
