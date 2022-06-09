<template>
  <div class="balances">
    <h3 v-text="$root.accountId"></h3>

    <div class="balances__items">
      <balance
        v-for="balance in balances"
        :key="balance.token"
        :app-balance="balance.appBalance"
        :token="balance.token"
        :wallet-balance="balance.walletBalance"
        :raw-balance="balance.rawBalance"
      ></balance>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Balance from './Balance.vue';

export default {
  name: 'Balances',

  components: { Balance },

  data: () => ({
    balances: {},
  }),

  computed: {
    ...mapGetters(['getBalances']),
  },

  mounted() {
    this.balances = this.getBalances.filter((it) => it.token.available);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
