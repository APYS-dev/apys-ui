import type { VaultMeta } from "@/network/models/InfoServerModels";
import type Big from "big.js";

export interface AutoFarmingConfig {
  cooldown: number;
  unlock_at: number;
  strategies: string[];
}

export interface AccountAutoFarming {
  active: boolean;
  enabled: boolean;
  config: Record<VaultMeta["category"], AutoFarmingConfig>;
  balances: Record<VaultMeta["category"], Record<string, Big>>;
}

export interface AutoFarmingChanges {
  cooldown: number;
  strategies: string[];
}
