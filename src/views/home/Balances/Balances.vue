<template>
  <div class="balances">
    <h3>walletname.near</h3>

    <div class="balances__items">
      <balance
        v-for="balance in balances"
        :key="balance.name"
        :name="balance.name"
        :amount="balance.amount"
        :logo-url="balance.logoUrl"
      ></balance>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
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
    this.loadBalances();
    this.balances = this.getBalances;
  },

  methods: {
    ...mapActions(['loadBalances']),
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
