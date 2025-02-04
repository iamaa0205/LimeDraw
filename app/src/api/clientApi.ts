import { ApiResponse } from '@calimero-is-near/calimero-p2p-sdk';

export interface Message {
  id: String;
  proposal_id: String;
  author: String;
  text: String;
  created_at: String;
}

export interface GetProposalMessagesRequest {
  // proposalId: String;
  proposal_id: String;
}

export interface GetProposalMessagesResponse {
  messages: Message[];
}

export interface SendProposalMessageRequest {
  // proposalId: String;
  proposal_id: String;
  message: Message;
}

export interface SendProposalMessageResponse {}

export enum ProposalActionType {
  ExternalFunctionCall = 'ExternalFunctionCall',
  Transfer = 'Transfer',
  SetNumApprovals = 'SetNumApprovals',
  SetActiveProposalsLimit = 'SetActiveProposalsLimit',
  SetContextValue = 'SetContextValue',
  DeleteProposal = 'DeleteProposal',
}

export type FormActionType =
  | 'Cross contract call'
  | 'Transfer'
  | 'Set context variable'
  | 'Change number of approvals needed'
  | 'Change number of maximum active proposals';

export interface ExternalFunctionCallAction {
  type: ProposalActionType.ExternalFunctionCall;
  receiver_id: string;
  method_name: string;
  args: Record<string, any>;
  deposit: string;
  gas?: string;
}

export interface TransferAction {
  type: ProposalActionType.Transfer;
  amount: string;
}

export interface CreateProposalRequest {
  action_type: string;
  params: {
    receiver_id?: string;
    method_name?: string;
    args?: string;
    deposit?: string;
    gas?: string;
    amount?: string;
    num_approvals?: number;
    active_proposals_limit?: number;
    key?: string;
    value?: string;
    proposal_id?: string;
  };
}

export interface CreateProposalResponse {
  proposal_id: String;
}

export interface ApproveProposalRequest {
  proposal_id: string;
}

export interface GetCalimeroPublicKeyRequest {
  proposal_id: string;
}

export interface GetCalimeroPublicKeyResponse {
  proposal_id: string;
}

export interface ApproveProposalResponse {}
// Request interface for incrementing the counter
export interface IncrementCounterRequest {}

// Response interface for incrementing the counter
export interface IncrementCounterResponse {
  success: boolean;
  new_value: number;
}

// Request interface for getting the counter value
export interface GetCounterValueRequest {}

// Response interface for getting the counter value
export interface GetCounterValueResponse {
  value: number;
}

export interface CreatePlayerRequest {
  name: string;
  calimero_public_key?: string;
}

export interface CreatePlayerResponse {
  success: boolean;
  message: string;
}
export interface GetAllPlayersRequest {
  // No parameters needed for this request
}

export interface GetAllPlayersResponse {
  players: Player[];
}

export interface Player {
  name: string;
  calimero_public_key: string;
  role: number; // 0 for regular player, other values for different roles
}

export interface CreateLotteryRequest {
  name: string;
  description: string;
  ticket_price: Number; // Using string for large numbers (to avoid precision issues)
  ticket_count: Number; // Same as above
  prize_pool: Number; // Same as above
  calimero_public_key?: string;
}

export interface CreateLotteryResponse {
  success: boolean;
  message: string;
  lottery: LotteryState | null;
}

export interface LotteryState {
  name: string;
  description: string;
  ticket_price: string;
  ticket_count: string;
  remaining_tickets: string;
  prize_pool: string;
  owner: Player | null;
  winner: Player | null;
}

export interface GetLotteryRequest {}

export interface GetLotteryResponse {
  success: boolean;
  lottery: LotteryState | null;
}
export interface GetPlayerRequest {
  calimeroPublicKey: string;
}
export interface GetPlayerResponse {
  success: boolean;
  player: Player | null;
}
export interface CreateMessageRoomRequest {
  id: string;
  name: string;
  text: string;
}

export interface CreateMessageRoomResponse {
  success: boolean;
  message: string;
}
export interface AddHostRequest {
  calimero_public_key?: string;
  name: string;
}

export interface AddHostResponse {
  success: boolean;
  message: string;
}
export interface GetMessageRoomsResponse {
  success: boolean;
  messageRooms: MessageRoom[];
}

export interface MessageRoom {
  id: string;
  text: string;
}

export interface GetMessageRoomsRequest {
  // If you need to filter messages, you can add optional parameters here
}

export enum ClientMethod {
  GET_PROPOSAL_MESSAGES = 'get_proposal_messages',
  SEND_PROPOSAL_MESSAGE = 'send_proposal_messages',
  CREATE_PROPOSAL = 'create_new_proposal',
  APPROVE_PROPOSAL = 'approve_proposal',
  GET_CALIMERO_PUBLIC_KEY = 'store_public_key',
  INCREMENT_COUNTER = 'increment_counter', // New: Increment the counter
  GET_COUNTER_VALUE = 'get_counter',
  CREATE_PLAYER = 'create_player',
  GET_ALL_PLAYERS = 'get_all_players',
  CREATE_LOTTERY = 'create_lottery',
  GET_LOTTERY = 'get_lottery',
  GET_PLAYER = 'get_player_by_public_key',
  ADD_HOST = 'add_host',
  AddMessage = 'create_message_room',
  GetMessage = 'get_all_message_rooms',
}

export interface ClientApi {
  //Cali Storage
  getProposalMessages(
    proposalsRequest: GetProposalMessagesRequest,
  ): ApiResponse<GetProposalMessagesResponse>;
  sendProposalMessage(
    sendMessageRequest: SendProposalMessageRequest,
  ): ApiResponse<SendProposalMessageResponse>;
  createProposal(
    request: CreateProposalRequest,
  ): ApiResponse<CreateProposalResponse>;
  approveProposal(
    request: ApproveProposalRequest,
  ): ApiResponse<ApproveProposalResponse>;
  deleteProposal(proposalId: string): ApiResponse<void>;
}
