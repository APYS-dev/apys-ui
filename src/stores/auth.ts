import { defineStore } from "pinia";
import { nearApi } from "@/network/api/NearApi";

interface State {
  isSignedIn: boolean;
  accountId: string;
}

export const useAuthStore = defineStore({
  id: "auth",
  state: (): State => ({
    isSignedIn: nearApi.wallet.isSignedIn(),
    accountId: nearApi.wallet.getAccountId(),
  }),
  actions: {},
});
