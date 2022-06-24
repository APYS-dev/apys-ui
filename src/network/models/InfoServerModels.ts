import type Big from "big.js";

export interface Metadata {
  apysContractId: string;
}

export interface TokenMeta {
  symbol: string;
  contractId: string;
  decimals: number;
  available: boolean;
  fractionDigits: number;
}

export interface TokenMetaWithPrice extends TokenMeta {
  price: Big;
  minDepositAmount: number;
}

export interface StrategyInfo {
  uuid: string;
  name: string;
  contractId: string;
  status: "live" | "upcoming" | "finished";
  depositTokens: TokenMetaWithPrice[];
  rewardTokens: string[];
  dex: "REF" | "JUMBO";
  dexUrl: string;
  apr: Big;
  tvl: Big;
  osc: Big;
}
