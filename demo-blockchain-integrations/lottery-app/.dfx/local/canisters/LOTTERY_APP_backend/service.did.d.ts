import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'addLottery' : ActorMethod<[bigint, string, string, string], undefined>,
  'buyTicket' : ActorMethod<[string, string], undefined>,
  'checkPublicKey' : ActorMethod<[Principal, string], undefined>,
  'checkWinnerDeclared' : ActorMethod<[string], [] | [boolean]>,
  'get1to2' : ActorMethod<[string], [] | [string]>,
  'get2to1' : ActorMethod<[string], [] | [string]>,
  'getNoTicket' : ActorMethod<[string], [] | [bigint]>,
  'getPrincipal' : ActorMethod<[string], [] | [Principal]>,
  'getPubKey' : ActorMethod<[string, bigint], [] | [string]>,
  'getcontextToPubKeyToTicket' : ActorMethod<[string, string], [] | [bigint]>,
  'init' : ActorMethod<[], undefined>,
  'setWinnerDeclared' : ActorMethod<[string], [] | [bigint]>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
