import type { VaultMetaDto } from "@/network/dtos/InfoServerDtos";

interface AutoFarmingConfigDto {
  cooldown: number;
  unlock_at: number;
  strategies: string[];
}

export interface AccountAutoFarmingDto {
  active: boolean;
  enabled: boolean;
  config: Record<VaultMetaDto["category"], AutoFarmingConfigDto>;
  balances: Record<VaultMetaDto["category"], Record<string, string>>;
}
