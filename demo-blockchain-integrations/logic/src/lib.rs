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
    counter:Counter,
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
pub struct Counter{
    value:u32,
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
            lottery_state : LotteryState {
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
    pub fn create_lottery(
        &mut self,
        name: String,
        description: String,
        ticket_price: u128,
        ticket_count: u128,
        prize_pool: u128,
        calimero_public_key: String,
    ) -> Result<(), Error> {
        // Debug log to check if the function is being called
        env::log(&format!(
            "📥 create_lottery called with: name={}, description={}, ticket_price={}, ticket_count={}, prize_pool={}, calimero_public_key={}",
            name, description, ticket_price, ticket_count, prize_pool, calimero_public_key
        ));
    
        // Validate parameters
        if name.is_empty() {
            env::log("❌ Error: Lottery name is empty");
            return Err(Error::msg("Lottery name cannot be empty"));
        }
        if ticket_price == 0 || ticket_count == 0 || prize_pool == 0 {
            env::log("❌ Error: Zero values are not allowed");
            return Err(Error::msg("Ticket price, count, and prize pool must be greater than 0"));
        }
    
        // Assign values
        self.lottery_state = LotteryState {
            name,
            description,
            ticket_price,
            ticket_count,
            remaining_tickets: ticket_count,
            prize_pool,
            owner: None,
            winner: None,
        };
    
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
