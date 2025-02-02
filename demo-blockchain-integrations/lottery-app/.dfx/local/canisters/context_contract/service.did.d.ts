import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface ICApplication {
  'id' : Uint8Array | number[],
  'source' : string,
  'metadata' : Uint8Array | number[],
  'blob' : Uint8Array | number[],
  'size' : bigint,
}
export type ICCapability = { 'Proxy' : null } |
  { 'ManageMembers' : null } |
  { 'ManageApplication' : null };
export interface ICSigned {
  'signature' : Uint8Array | number[],
  '_phantom' : null,
  'payload' : Uint8Array | number[],
}
export type Result = { 'Ok' : null } |
  { 'Err' : string };
export interface _SERVICE {
  'application' : ActorMethod<[Uint8Array | number[]], ICApplication>,
  'application_revision' : ActorMethod<[Uint8Array | number[]], bigint>,
  'fetch_nonce' : ActorMethod<
    [Uint8Array | number[], Uint8Array | number[]],
    [] | [bigint]
  >,
  'has_member' : ActorMethod<
    [Uint8Array | number[], Uint8Array | number[]],
    boolean
  >,
  'members' : ActorMethod<
    [Uint8Array | number[], bigint, bigint],
    Array<Uint8Array | number[]>
  >,
  'members_revision' : ActorMethod<[Uint8Array | number[]], bigint>,
  'mutate' : ActorMethod<[ICSigned], Result>,
  'privileges' : ActorMethod<
    [Uint8Array | number[], Array<Uint8Array | number[]>],
    Array<[Uint8Array | number[], Array<ICCapability>]>
  >,
  'proxy_contract' : ActorMethod<[Uint8Array | number[]], Principal>,
  'set_proxy_code' : ActorMethod<[Uint8Array | number[]], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
