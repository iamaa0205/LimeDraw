export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    addLottery: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [], []),
    buyTicket: IDL.Func([IDL.Vec(IDL.Nat8)], [], []),
    checkPublicKey: IDL.Func([IDL.Principal, IDL.Text], [], []),
    checkWinnerDeclared: IDL.Func([IDL.Text], [IDL.Opt(IDL.Bool)], ['query']),
    extractStrings: IDL.Func([IDL.Vec(IDL.Nat8)], [IDL.Text, IDL.Text], []),
    get1to2: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
    get2to1: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
    getAvailableNoTicket: IDL.Func([IDL.Text], [IDL.Nat], ['query']),
    getNoTicket: IDL.Func([IDL.Text], [IDL.Nat], ['query']),
    getPrincipal: IDL.Func([IDL.Text], [IDL.Opt(IDL.Principal)], ['query']),
    getPubKey: IDL.Func([IDL.Text, IDL.Nat], [IDL.Opt(IDL.Text)], ['query']),
    getUniqueUsers: IDL.Func([IDL.Text], [IDL.Nat], []),
    getWinningTicket: IDL.Func([IDL.Text], [IDL.Opt(IDL.Nat)], ['query']),
    getcontextToPubKeyToTicket: IDL.Func(
      [IDL.Text, IDL.Text],
      [IDL.Opt(IDL.Nat)],
      ['query'],
    ),
    gf: IDL.Func([], [], []),
    gf1: IDL.Func([IDL.Vec(IDL.Nat8)], [], []),
    gf2: IDL.Func([IDL.Vec(IDL.Nat8)], [], []),
    init: IDL.Func([], [], []),
    printgf2: IDL.Func([], [IDL.Vec(IDL.Nat8)], []),
    setWinnerDeclared: IDL.Func([IDL.Vec(IDL.Nat8)], [IDL.Opt(IDL.Nat)], []),
    test: IDL.Func([], [IDL.Nat], ['query']),
    test12: IDL.Func([], [IDL.Text], ['query']),
    test13: IDL.Func([], [IDL.Text], ['query']),
    test14: IDL.Func([], [IDL.Principal], ['query']),
  });
};
export const init = ({ IDL }) => {
  return [];
};
