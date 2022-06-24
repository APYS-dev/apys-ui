import { defineStore } from "pinia";
import type {
  TokenMeta,
  Metadata,
  StrategyMeta,
} from "@/network/models/InfoServerModels";
import { infoServerApi } from "@/network/api/InfoServerApi";
import Big from "big.js";

interface State {
  totalTvl: Big;
  metadata: Metadata;
  strategies: StrategyMeta[];
  tokens: TokenMeta[];
}

export const useGeneralStore = defineStore({
  id: "general",
  state: (): State => ({
    totalTvl: new Big(0),
    metadata: {
      apysContractId: "",
    },
    strategies: [],
    tokens: [],
  }),
  getters: {},
  actions: {
    async fetchInfo() {
      // Fetch info from info server
      const response = await infoServerApi.getInfo();

      // Calculate and set total TVL
      this.totalTvl = response.strategies
        .map((strategy) => strategy.tvl)
        .reduce((a, b) => {
          return a.add(b);
        }, new Big(0));

      // Set other data
      this.tokens = response.tokens;
      this.metadata = response.metadata;
      this.strategies = response.strategies;
    },
  },
});
