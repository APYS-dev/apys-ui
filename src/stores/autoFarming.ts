import type {
  AccountAutoFarming,
  AutoFarmingChanges,
} from "@/network/models/ApysModels";
import { defineStore } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { apysApi } from "@/network/api/ApysApi";
import type { VaultMeta } from "@/network/models/InfoServerModels";

export const useAutoFarmingStore = defineStore({
  id: "autoFarming",
  state: (): AccountAutoFarming => ({
    enabled: false,
    active: false,
    balances: Object.create({}),
    config: Object.create({}),
  }),
  actions: {
    async fetchAutoFarmingConfig(): Promise<void> {
      // Get stores
      const { accountId } = useAuthStore();

      // Fetch config from APYS contract
      const config = await apysApi.getAccountAutoFarmingConfig(accountId);

      // Update state
      this.enabled = config.enabled;
      this.active = config.active;
      this.balances = config.balances;
      this.config = config.config;
    },

    async startAutoFarming(
      configs: Record<VaultMeta["category"], AutoFarmingChanges>
    ) {
      return apysApi.startAutoFarming(configs);
    },

    async updateAutoFarming(
      enabled: boolean,
      changes: Record<VaultMeta["category"], AutoFarmingChanges>
    ) {
      return apysApi.updateAutoFarming(enabled, changes);
    },
  },
});
