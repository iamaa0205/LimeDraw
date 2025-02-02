export const idlFactory = ({ IDL }) => {
  const ICApplication = IDL.Record({
    'id' : IDL.Vec(IDL.Nat8),
    'source' : IDL.Text,
    'metadata' : IDL.Vec(IDL.Nat8),
    'blob' : IDL.Vec(IDL.Nat8),
    'size' : IDL.Nat64,
  });
  const ICSigned = IDL.Record({
    'signature' : IDL.Vec(IDL.Nat8),
    '_phantom' : IDL.Null,
    'payload' : IDL.Vec(IDL.Nat8),
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const ICCapability = IDL.Variant({
    'Proxy' : IDL.Null,
    'ManageMembers' : IDL.Null,
    'ManageApplication' : IDL.Null,
  });
  return IDL.Service({
    'application' : IDL.Func([IDL.Vec(IDL.Nat8)], [ICApplication], ['query']),
    'application_revision' : IDL.Func(
        [IDL.Vec(IDL.Nat8)],
        [IDL.Nat64],
        ['query'],
      ),
    'fetch_nonce' : IDL.Func(
        [IDL.Vec(IDL.Nat8), IDL.Vec(IDL.Nat8)],
        [IDL.Opt(IDL.Nat64)],
        ['query'],
      ),
    'has_member' : IDL.Func(
        [IDL.Vec(IDL.Nat8), IDL.Vec(IDL.Nat8)],
        [IDL.Bool],
        ['query'],
      ),
    'members' : IDL.Func(
        [IDL.Vec(IDL.Nat8), IDL.Nat64, IDL.Nat64],
        [IDL.Vec(IDL.Vec(IDL.Nat8))],
        ['query'],
      ),
    'members_revision' : IDL.Func([IDL.Vec(IDL.Nat8)], [IDL.Nat64], ['query']),
    'mutate' : IDL.Func([ICSigned], [Result], []),
    'privileges' : IDL.Func(
        [IDL.Vec(IDL.Nat8), IDL.Vec(IDL.Vec(IDL.Nat8))],
        [IDL.Vec(IDL.Tuple(IDL.Vec(IDL.Nat8), IDL.Vec(ICCapability)))],
        ['query'],
      ),
    'proxy_contract' : IDL.Func(
        [IDL.Vec(IDL.Nat8)],
        [IDL.Principal],
        ['query'],
      ),
    'set_proxy_code' : IDL.Func([IDL.Vec(IDL.Nat8)], [Result], []),
  });
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
