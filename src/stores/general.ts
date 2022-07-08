import { defineStore } from "pinia";
import type {
  TokenMeta,
  Metadata,
  VaultMeta,
} from "@/network/models/InfoServerModels";
import { infoServerApi } from "@/network/api/InfoServerApi";
import Big from "big.js";

interface State {
  totalTvl: Big;
  metadata: Metadata;
  vaults: VaultMeta[];
  tokens: TokenMeta[];
}

export const useGeneralStore = defineStore({
  id: "general",
  state: (): State => ({
    totalTvl: new Big(0),
    metadata: {
      apysContractId: "",
      bonusRewardsTokenId: "",
      bonusToken: {} as TokenMeta,
    },
    vaults: [],
    tokens: [],
  }),
  getters: {},
  actions: {
    async fetchInfo() {
      // Fetch info from info server
      const response = await infoServerApi.getInfo();

      // Calculate and set total TVL
      this.totalTvl = response.vaults
        .map((vault) => vault.tvl)
        .reduce((a, b) => {
          return a.add(b);
        }, new Big(0));

      // Set other data
      this.tokens = response.tokens;
      this.metadata = response.metadata;
      this.vaults = response.vaults;
    },
  },
});
