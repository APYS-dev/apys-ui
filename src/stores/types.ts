import type { VaultMeta, TokenMeta } from "@/network/models/InfoServerModels";
import type Big from "big.js";
import type { AccountProgress } from "@/network/models/VaultModels";

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
  progress: AccountProgress;
  progressLoaded: boolean;
}
