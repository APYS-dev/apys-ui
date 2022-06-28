export interface GetInfoResponseDto {
  strategies: VaultMetaDto[];
  tokens: TokenMetaDto[];
  metadata: MetadataDto;
}

export interface MetadataDto {
  apysContractId: string;
}

export interface TokenMetaDto {
  symbol: string;
  contractId: string;
  decimals: number;
  available: boolean;
  fractionDigits: number;
}

export interface TokenMetaWithPriceDto extends TokenMetaDto {
  price: number;
  minDepositAmount: number;
}

export interface VaultMetaDto {
  uuid: string;
  name: string;
  contractId: string;
  status: "live" | "upcoming" | "finished";
  depositTokens: TokenMetaWithPriceDto[];
  dex: "REF" | "JUMBO";
  dexUrl: string;
  apr: string;
  tvl: number;
  osc: string;
  rewardTokens: string[];
}
