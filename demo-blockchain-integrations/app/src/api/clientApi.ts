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




export interface CreateLotteryRequest {
  name: String;
  description: String;
  ticket_price: Number;  // using string to represent u128 (BigInt in JS)
  ticket_count: Number;  // using string to represent u128 (BigInt in JS)
  prize_pool: Number;  // using string to represent u128 (BigInt in JS)
  calimero_public_key: String;
}

export interface CreateLotteryResponse {
}

export enum ClientMethod {
  GET_PROPOSAL_MESSAGES = 'get_proposal_messages',
  SEND_PROPOSAL_MESSAGE = 'send_proposal_messages',
  CREATE_PROPOSAL = 'create_new_proposal',
  APPROVE_PROPOSAL = 'approve_proposal',
  GET_CALIMERO_PUBLIC_KEY = 'store_public_key',
  CREATE_LOTTERY = 'create_lottery', 
  INCREMENT_COUNTER = 'increment_counter',  // New: Increment the counter
  GET_COUNTER_VALUE = 'get_counter_value',
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
