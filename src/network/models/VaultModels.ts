import type Big from "big.js";

export interface AccountTotalBalance {
  withdraw: { [tokenId: string]: Big };
  deposit: { [tokenId: string]: Big };
  shares: Big;
  staked_shares: Big;
  reward_shares: Big;
}
