import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from './service.did';
export const init = ({ IDL }) => {
  return [];
};
const agent = new HttpAgent({ host: 'http://127.0.0.1:4943' });

if (process.env.NODE_ENV !== 'production') {
  // Enable the agent to connect to the local replica (only in non-production environments)
  agent.fetchRootKey();
}

const canisterId = 'br5f7-7uaaa-aaaaa-qaaca-cai'; // Replace this with your canister ID

const lotteryAppBackend = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});

export async function addLottery(num, t1, t2, pubKey) {
  try {
    return await lotteryAppBackend.addLottery(num, t1, t2, pubKey);
  } catch (error) {
    console.error('Error adding lottery:', error);
    throw error;
  }
}
export async function buyTicket(contextId, calimeroPubKey) {
  try {
    return await lotteryAppBackend.buyTicket(contextId, calimeroPubKey);
  } catch (error) {
    console.error('error buying tickert', error);
  }
}
export async function checkWinnerDeclared(contextId) {
  try {
    return await lotteryAppBackend.checkWinnerDeclared(contextId);
  } catch (error) {
    console.error('error checking winner', error);
  }
}

export async function getNoTicket(contextId) {
  try {
    return await lotteryAppBackend.getNoTicket(contextId);
  } catch (error) {
    console.error('error checking winner', error);
  }
}
export async function getAvailableNoTicket(contextId) {
  try {
    return await lotteryAppBackend.getAvailableNoTicket(contextId);
  } catch (error) {
    console.error('error checking winner', error);
  }
}

export async function getUniqueUsers(contextId) {
  try {
    return await lotteryAppBackend.getUniqueUsers(contextId);
  } catch (error) {
    console.error('error checking winner', error);
  }
}

export async function setWinnerDeclared(contextId) {
  try {
    return await lotteryAppBackend.setWinnerDeclared(contextId);
  } catch (error) {
    console.error('error checking winner', error);
  }
}
export async function getWinningTicket(context1) {
  try {
    return await lotteryAppBackend.getWinningTicket(context1);
  } catch (error) {
    console.error('Error adding lottery:', error);
    throw error;
  }
}

export async function getPubKey(context1, winningTicket) {
  try {
    return await lotteryAppBackend.getPubKey(context1, winningTicket);
  } catch (error) {
    console.error('Error adding lottery:', error);
    throw error;
  }
}
