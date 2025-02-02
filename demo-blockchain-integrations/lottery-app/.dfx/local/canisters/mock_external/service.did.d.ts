import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'clear_state' : ActorMethod<[], undefined>,
  'get_calls' : ActorMethod<[], Array<Uint8Array | number[]>>,
  'test_method' : ActorMethod<[Uint8Array | number[]], Uint8Array | number[]>,
  'test_method_no_transfer' : ActorMethod<
    [Uint8Array | number[]],
    Uint8Array | number[]
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
