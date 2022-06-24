import type {
  StrategyMeta,
  TokenMeta,
} from "@/network/models/InfoServerModels";
import type Big from "big.js";

export interface TokenBalance {
  meta: TokenMeta;
  appBalance: Big;
  appBalanceLoaded: boolean;
  walletBalance: Big;
  walletBalanceLoaded: boolean;
}

export interface Strategy {
  meta: StrategyMeta;
}
