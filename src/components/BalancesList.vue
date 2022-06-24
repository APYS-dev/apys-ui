<template>
  <div class="balances">
    <h3 v-if="isSignedIn" v-text="accountId" />

    <AccountBalance
      v-for="balance in balances"
      :key="balance.token.contractId"
      :balance="balance"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import AccountBalance from "@/components/AccountBalance.vue";
import { useBalanceStore } from "@/stores/balance";
import type { TokenBalance } from "@/stores/types";

export default defineComponent({
  components: { AccountBalance },

  data() {
    return {
      isSignedIn: false,
      accountId: "",
      balances: [] as TokenBalance[],
    };
  },

  async mounted() {
    // Get account data
    const { isSignedIn, accountId } = useAuthStore();
    this.isSignedIn = isSignedIn;
    this.accountId = accountId;

    // Listen for balance store changes
    const generalStore = useBalanceStore();
    watch(generalStore.$state, async (state) => {
      if (this.balances !== state.balances) {
        this.balances = state.balances;
      }
    });
  },
});
</script>

<style lang="scss" scoped>
.balances {
  padding: 16px 24px;
  background-color: var(--background-color);
  box-shadow: 0px -4px 50px rgba(47, 91, 96, 0.08);
  border-radius: 4px;

  h3 {
    margin-bottom: 20px;
  }
}
</style>
