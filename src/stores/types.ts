import type { VaultMeta, TokenMeta } from "@/network/models/InfoServerModels";
import type Big from "big.js";
import type {
  AccountProgress,
  VaultContractMetadata,
} from "@/network/models/VaultModels";

export interface TokenBalance {
  meta: TokenMeta;
  appBalance: Big;
  appBalanceLoaded: boolean;
  walletBalance: Big;
  walletBalanceLoaded: boolean;
}

export interface Vault {
  meta: VaultMeta;
  contractMeta: VaultContractMetadata;
  progress: AccountProgress;
  balanceInDollars: Big;
  rewardInDollars: Big;
  isProcessing: boolean;
  balancesLoaded: boolean;
  progressLoaded: boolean;
  contractMetaLoaded: boolean;
}
