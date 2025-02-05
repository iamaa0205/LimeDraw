export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    addLottery: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [], []),
    buyTicket: IDL.Func([IDL.Text, IDL.Text], [], []),
    checkPublicKey: IDL.Func([IDL.Principal, IDL.Text], [], []),
    checkWinnerDeclared: IDL.Func([IDL.Text], [IDL.Opt(IDL.Bool)], ['query']),
    get1to2: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
    get2to1: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
    getNoTicket: IDL.Func([IDL.Text], [IDL.Opt(IDL.Nat)], ['query']),
    getPrincipal: IDL.Func([IDL.Text], [IDL.Opt(IDL.Principal)], ['query']),
    getPubKey: IDL.Func([IDL.Text, IDL.Nat], [IDL.Opt(IDL.Text)], ['query']),
    getWinningTicket: IDL.Func([IDL.Text], [IDL.Opt(IDL.Nat)], ['query']),
    getcontextToPubKeyToTicket: IDL.Func(
      [IDL.Text, IDL.Text],
      [IDL.Opt(IDL.Nat)],
      ['query'],
    ),
    init: IDL.Func([], [], []),
    setWinnerDeclared: IDL.Func([IDL.Text], [IDL.Opt(IDL.Nat)], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
