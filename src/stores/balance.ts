import { defineStore } from "pinia";
import { useAuthStore } from "@/stores/auth";
import type { TokenBalance } from "@/stores/types";
import type { TokenMeta } from "@/network/models/InfoServerModels";
import { fungibleTokenApi } from "@/network/api/FungibleTokenApi";
import Big from "big.js";

interface State {
  balances: TokenBalance[];
}

export const useBalanceStore = defineStore({
  id: "balance",
  state: (): State => ({
    balances: [],
  }),
  getters: {
    getBalanceByToken: (state: State) => (tokenId: string) => {
      return (
        state.balances.find((it) => it.meta.contractId === tokenId)
          ?.walletBalance ?? new Big(0)
      );
    },
    checkWalletBalanceLoadedForToken: (state: State) => (tokenId: string) => {
      return (
        state.balances.find((it) => it.meta.contractId === tokenId)
          ?.walletBalanceLoaded ?? false
      );
    },
  },
  actions: {
    initBalancesByTokensMeta(tokens: TokenMeta[]) {
      this.balances = tokens.map((token) => ({
        meta: token,
        walletBalance: Big(0),
        walletBalanceLoaded: false,
      }));
    },

    async fetchWalletBalance(tokenId: string): Promise<boolean> {
      // Get stores
      const { accountId } = useAuthStore();

      // Fetch info from info server
      const response = await fungibleTokenApi.getBalanceOf(accountId, tokenId);

      // Update state
      const balanceIndex = this.balances.findIndex(
        (it) => it.meta.contractId === tokenId
      );
      if (balanceIndex !== -1) {
        this.balances[balanceIndex] = {
          ...this.balances[balanceIndex],
          walletBalance: response,
          walletBalanceLoaded: true,
        };

        // Return true if balance fetched
        return true;
      }
      // Otherwise, return false
      return false;
    },
  },
});
