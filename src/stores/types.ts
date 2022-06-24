import type { TokenMeta } from "@/network/models/InfoServerModels";
import type Big from "big.js";

export interface TokenBalance {
  token: TokenMeta;
  appBalance: Big;
  appBalanceLoaded: boolean;
  walletBalance: Big;
  walletBalanceLoaded: boolean;
}
