export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'clear_state' : IDL.Func([], [], []),
    'get_calls' : IDL.Func([], [IDL.Vec(IDL.Vec(IDL.Nat8))], ['query']),
    'test_method' : IDL.Func([IDL.Vec(IDL.Nat8)], [IDL.Vec(IDL.Nat8)], []),
    'test_method_no_transfer' : IDL.Func(
        [IDL.Vec(IDL.Nat8)],
        [IDL.Vec(IDL.Nat8)],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
