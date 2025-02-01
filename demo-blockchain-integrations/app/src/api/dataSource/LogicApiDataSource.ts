import {
  ApiResponse,
  JsonRpcClient,
  RequestConfig,
  WsSubscriptionsClient,
  RpcError,
  handleRpcError,
  RpcQueryParams,
} from '@calimero-is-near/calimero-p2p-sdk';

import {
  ApproveProposalRequest,
  ApproveProposalResponse,
  ClientApi,
  ClientMethod,
  CreateProposalRequest,
  CreateProposalResponse,
  GetProposalMessagesRequest,
  GetProposalMessagesResponse,
  SendProposalMessageRequest,
  SendProposalMessageResponse,
  GetCalimeroPublicKeyRequest,
  GetCalimeroPublicKeyResponse,
  CreateLotteryRequest,
  CreateLotteryResponse,

  GetCounterValueRequest,
  GetCounterValueResponse,
  IncrementCounterRequest,
  IncrementCounterResponse,
  CreatePlayerRequest,
  CreatePlayerResponse,
  GetAllPlayersRequest,
  GetAllPlayersResponse,
  GetLotteryRequest,
  GetLotteryResponse,
  Player,
  GetPlayerRequest,
  GetPlayerResponse
} from '../clientApi';
import { getContextId, getNodeUrl } from '../../utils/node';
import {
  getJWTObject,
  getStorageAppEndpointKey,
  JsonWebToken,
} from '../../utils/storage';
import { AxiosHeader, createJwtHeader } from '../../utils/jwtHeaders';
import { getRpcPath } from '../../utils/env';

export function getJsonRpcClient() {
  return new JsonRpcClient(getStorageAppEndpointKey() ?? '', getRpcPath());
}

export function getWsSubscriptionsClient() {
  return new WsSubscriptionsClient(getStorageAppEndpointKey() ?? '', '/ws');
}

export function getConfigAndJwt() {
  const jwtObject: JsonWebToken | null = getJWTObject();
  const headers: AxiosHeader | null = createJwtHeader();
  if (!headers) {
    return {
      error: { message: 'Failed to create auth headers', code: 500 },
    };
  }
  if (!jwtObject) {
    return {
      error: { message: 'Failed to get JWT token', code: 500 },
    };
  }
  if (jwtObject.executor_public_key === null) {
    return {
      error: { message: 'Failed to get executor public key', code: 500 },
    };
  }

  const config: RequestConfig = {
    headers: headers,
    timeout: 10000,
  };

  return { jwtObject, config };
}

export class LogicApiDataSource implements ClientApi {

  async createLottery(
    request: CreateLotteryRequest,
  ): ApiResponse<CreateLotteryResponse> {
    const { jwtObject, config, error } = getConfigAndJwt();
    if (error) {
      return { error };
    }
  
    const params: RpcQueryParams<typeof request> = {
      contextId: jwtObject?.context_id ?? getContextId(),
      method: ClientMethod.CREATE_LOTTERY,
      argsJson: {
        name: request.name || "Untitled Lottery", // Ensure default values
        description: request.description || "hehehehehehe", 
        ticket_price: Number(request.ticket_price) || 1,
        ticket_count: Number(request.ticket_count) || 1,
        prize_pool: Number(request.prize_pool) || 1,
        calimero_public_key: jwtObject.executor_public_key || "default-key", // Fallback to default public key
      },
      executorPublicKey: jwtObject.executor_public_key,
    };
  
    console.log('RPC params:', params);
  
    const response = await getJsonRpcClient().execute<
      typeof request,
      CreateLotteryResponse
    >(params, config);
  
    console.log('Raw response:', response);
  
    if (response?.error) {
      console.error('RPC error:', response.error);
      return await this.handleError(response.error, {}, this.createLottery); // Using `this.createLottery` here for retry
    }
  
    return {
      data: response.result.output as CreateLotteryResponse,
      error: null,
    };
  }

  async getLottery(
  ): ApiResponse<GetLotteryResponse> {
    const { jwtObject, config, error } = getConfigAndJwt();
    if (error) {
      return { error };
    }

    const params: RpcQueryParams<typeof request> = {
      contextId: jwtObject?.context_id ?? getContextId(),
      method: ClientMethod.GET_LOTTERY,
      argsJson: {},
      executorPublicKey: jwtObject.executor_public_key,
    };

    console.log('RPC params:', params);

    const response = await getJsonRpcClient().execute<
      typeof request,
      GetLotteryResponse
    >(params, config);

    console.log('Raw response:', response);

    if (response?.error) {
      console.error('RPC error:', response.error);
      return await this.handleError(response.error, request, this.getLottery);
    }

    return {
      data: response.result.output as GetLotteryResponse,
      error: null,
    };
  }


  async createPlayer(
    request: CreatePlayerRequest,
  ): ApiResponse<CreatePlayerResponse> {
    const { jwtObject, config, error } = getConfigAndJwt();
    if (error) {
      return { error };
    }
  
    const params: RpcQueryParams<typeof request> = {
      contextId: jwtObject?.context_id ?? getContextId(),
      method: ClientMethod.CREATE_PLAYER,
      argsJson: {
        name: request.name || "Anonymous Player", // Default name
        calimero_public_key: jwtObject.executor_public_key || "default-key",
      },
      executorPublicKey: jwtObject.executor_public_key,
    };
  
    console.log('RPC params:', params);
  
    const response = await getJsonRpcClient().execute<
      typeof request,
      CreatePlayerResponse
    >(params, config);
  
    console.log('Raw response:', response);
  
    if (response?.error) {
      console.error('RPC error:', response.error);
      return await this.handleError(response.error, {}, this.createPlayer);
    }
  
    return {
      data: response.result.output as CreatePlayerResponse,
      error: null,
    };
  }



  async getAllPlayers(): ApiResponse<GetAllPlayersResponse> {
    const { jwtObject, config, error } = getConfigAndJwt();
    if (error) {
      return { error };
    }
  
    const params: RpcQueryParams<{}>= {
      contextId: jwtObject?.context_id ?? getContextId(),
      method: ClientMethod.GET_ALL_PLAYERS,
      argsJson: {}, // No arguments needed
      executorPublicKey: jwtObject.executor_public_key,
    };
  
    console.log('RPC params:', params);
  
    const response = await getJsonRpcClient().execute<null, GetAllPlayersResponse>(params, config);
  
    console.log('Raw response:', response);
  
    if (response?.error) {
      console.error('RPC error:', response.error);
      return await this.handleError(response.error, {}, this.getAllPlayers);
    }
  
    return {
      data: response.result.output as GetAllPlayersResponse,
      error: null,
    };
  }
  


  async getPlayerByPublicKey(): ApiResponse<GetPlayerResponse> {
    const { jwtObject, config, error } = getConfigAndJwt();
    if (error) {
      return { error };
    }
  
    const params: RpcQueryParams<{ calimero_public_key: string }> = {
      contextId: jwtObject?.context_id ?? getContextId(),
      method: ClientMethod.GET_PLAYER,
      argsJson: { calimero_public_key:jwtObject.executor_public_key  }, // Passing the public key as an argument
      executorPublicKey: jwtObject.executor_public_key,
    };
  
    console.log('RPC params:', params);
  
    const response = await getJsonRpcClient().execute<null, GetPlayerResponse>(params, config);
  
    console.log('Raw response:', response);
  
    if (response?.error) {
      console.error('RPC error:', response.error);
      return await this.handleError(response.error, {}, this.getPlayerByPublicKey);
    }
  
    return {
      data: response.result.output as GetPlayerResponse,
      error: null,
    };
  }
  
  
  
  async incrementCounter(): ApiResponse<IncrementCounterResponse> {
    const { jwtObject, config, error } = getConfigAndJwt();
    if (error) {
      return { error };
    }
  
    const params: RpcQueryParams<{}> = {
      contextId: jwtObject?.context_id ?? getContextId(),
      method: ClientMethod.INCREMENT_COUNTER,
      argsJson: {}, // No arguments needed
      executorPublicKey: jwtObject.executor_public_key,
    };
  
    console.log('RPC params:', params);
  
    const response = await getJsonRpcClient().execute<{}, IncrementCounterResponse>(params, config);
  
    console.log('Raw response:', response);
  
    if (response?.error) {
      console.error('RPC error:', response.error);
      return await this.handleError(response.error, {}, this.incrementCounter);
    }
  
    return {
      data: response.result.output as IncrementCounterResponse,
      error: null,
    };
  }
  
  async getCounterValue(): ApiResponse<GetCounterValueResponse> {
    const { jwtObject, config, error } = getConfigAndJwt();
    if (error) {
      return { error };
    }
  
    const params: RpcQueryParams<{}> = {
      contextId: jwtObject?.context_id ?? getContextId(),
      method: ClientMethod.GET_COUNTER_VALUE,
      argsJson: {}, // No arguments needed
      executorPublicKey: jwtObject.executor_public_key,
    };
  
    console.log('RPC params:', params);
  
    const response = await getJsonRpcClient().execute<{}, GetCounterValueResponse>(params, config);
  
    console.log('Raw response:', response);
  
    if (response?.error) {
      console.error('RPC error:', response.error);
      return await this.handleError(response.error, {}, this.getCounterValue);
    }
  
    return {
      data: response.result.output as GetCounterValueResponse,
      error: null,
    };
  }
  


  

  async createProposal(
    request: CreateProposalRequest,
  ): ApiResponse<CreateProposalResponse> {
    const { jwtObject, config, error } = getConfigAndJwt();
    if (error) {
      return { error };
    }

    console.log('Creating proposal with request:', request);

    const params: RpcQueryParams<typeof request> = {
      contextId: jwtObject?.context_id ?? getContextId(),
      method: ClientMethod.CREATE_PROPOSAL,
      argsJson: {request:request},
      
      executorPublicKey: jwtObject.executor_public_key,
    };

    console.log('RPC params:', params);

    try {
      const response = await getJsonRpcClient().execute<
        typeof request,
        CreateProposalResponse
      >(params, config);

      console.log('Raw response:', response);

      if (response?.error) {
        console.error('RPC error:', response.error);
        return await this.handleError(response.error, {}, this.createProposal);
      }

      if (!response?.result?.output) {
        console.error('Invalid response format:', response);
        return {
          error: { message: 'Invalid response format', code: 500 },
          data: null,
        };
      }

      return {
        data: response.result.output as CreateProposalResponse,
        error: null,
      };
    } catch (err) {
      console.error('Unexpected error:', err);
      return {
        error: { message: err.message || 'Unexpected error', code: 500 },
        data: null,
      };
    }
  }

  async approveProposal(
    request: ApproveProposalRequest,
  ): ApiResponse<ApproveProposalResponse> {
    const { jwtObject, config, error } = getConfigAndJwt();
    if (error) {
      return { error };
    }

    console.log('appoveProposal', request);

    const params: RpcQueryParams<ApproveProposalRequest> = {
      contextId: jwtObject?.context_id ?? getContextId(),
      method: ClientMethod.APPROVE_PROPOSAL,
      argsJson: request,
      executorPublicKey: jwtObject.executor_public_key,
    };

    const response = await getJsonRpcClient().execute<
      ApproveProposalRequest,
      ApproveProposalResponse
    >(params, config);

    console.log('appoveProposal response', response);

    if (response?.error) {
      return await this.handleError(response.error, {}, this.approveProposal);
    }

    return {
      data: {},
      error: null,
    };
  }

  async getProposalMessages(
    request: GetProposalMessagesRequest,
  ): ApiResponse<GetProposalMessagesResponse> {
    const { jwtObject, config, error } = getConfigAndJwt();
    if (error) {
      return { error };
    }

    console.log('getProposalMessages', request);

    const params: RpcQueryParams<GetProposalMessagesRequest> = {
      contextId: jwtObject?.context_id ?? getContextId(),
      method: ClientMethod.GET_PROPOSAL_MESSAGES,
      argsJson: request,
      executorPublicKey: jwtObject.executor_public_key,
    };

    const response = await getJsonRpcClient().query<
      GetProposalMessagesRequest,
      GetProposalMessagesResponse
    >(params, config);

    console.log('getProposalMessages response', response);

    if (response?.error) {
      return await this.handleError(
        response.error,
        {},
        this.getProposalMessages,
      );
    }

    let getProposalsResponse: GetProposalMessagesResponse = {
      messages: response?.result?.output?.messages,
    } as GetProposalMessagesResponse;

    return {
      data: getProposalsResponse,
      error: null,
    };
  }
  async sendProposalMessage(
    request: SendProposalMessageRequest,
  ): ApiResponse<SendProposalMessageResponse> {
    const { jwtObject, config, error } = getConfigAndJwt();
    if (error) {
      return { error };
    }

    const response = await getJsonRpcClient().execute<
      SendProposalMessageRequest,
      SendProposalMessageResponse
    >(
      {
        contextId: jwtObject?.context_id ?? getContextId(),
        method: ClientMethod.SEND_PROPOSAL_MESSAGE,
        argsJson: request,
        executorPublicKey: jwtObject.executor_public_key,
      },
      config,
    );
    if (response?.error) {
      return await this.handleError(
        response.error,
        {},
        this.sendProposalMessage,
      );
    }

    return {
      data: {},
      error: null,
    };
  }

  private async handleError(
    error: RpcError,
    params: any,
    callbackFunction: any,
  ) {
    if (error && error.code) {
      const response = await handleRpcError(error, getNodeUrl);
      if (response.code === 403) {
        return await callbackFunction(params);
      }
      return {
        error: await handleRpcError(error, getNodeUrl),
      };
    }
  }
}
