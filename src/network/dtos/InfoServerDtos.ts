export interface GetInfoResponse {
  strategies: StrategyInfoDto[];
  tokens: DepositTokenDto[];
  metadata: MetadataDto;
}

export interface MetadataDto {
  apysContractId: string;
}

export interface DepositTokenDto {
  symbol: string;
  contractId: string;
  decimals: number;
}

export interface DepositTokenWithPriceDto extends DepositTokenDto {
  price: number;
  minDepositAmount: number;
}

export interface StrategyInfoDto {
  uuid: string;
  name: string;
  contractId: string;
  status: "live" | "upcoming" | "finished";
  depositTokens: DepositTokenWithPriceDto[];
  dex: "REF" | "JUMBO";
  dexUrl: string;
  apr: string;
  tvl: number;
  osc: string;
  rewardTokens: string[];
}
