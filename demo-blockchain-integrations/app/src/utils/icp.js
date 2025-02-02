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
export async function buyTicket(){
    try {
        return await lotteryAppBackend.buyTicket();
        
    } catch (error) {
        console.error("error buying tickert",error)
        
    }
}
export async function checkWinnerDeclared(){
    try {
        return await lotteryAppBackend.checkWinnerDeclared();
        
    } catch (error) {
        console.error("error checking winner",error)
        
    }
}

