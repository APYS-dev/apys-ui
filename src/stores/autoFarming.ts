import type { AccountAutoFarming } from "@/network/models/ApysModels";
import { defineStore } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { apysApi } from "@/network/api/ApysApi";

interface State {
  config: AccountAutoFarming;
}

export const useAutoFarmingStore = defineStore({
  id: "autoFarming",
  state: (): State => ({
    config: {
      enabled: false,
      active: false,
      balances: Object.create({}),
      config: Object.create({}),
    },
  }),
  actions: {
    async fetchAutoFarmingConfig(): Promise<void> {
      // Get stores
      const { accountId } = useAuthStore();

      // Fetch config from APYS contract
      // Update state
      this.config = await apysApi.getAccountAutoFarmingConfig(accountId);
    },
  },
});
