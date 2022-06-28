import type { VaultMeta, TokenMeta } from "@/network/models/InfoServerModels";
import type Big from "big.js";

export interface TokenBalance {
  meta: TokenMeta;
  appBalance: Big;
  appBalanceLoaded: boolean;
  walletBalance: Big;
  walletBalanceLoaded: boolean;
}

export interface Vault {
  meta: VaultMeta;
  balanceInDollars: Big;
  rewardInDollars: Big;
  isProcessing: boolean;
  balancesLoaded: boolean;
}
