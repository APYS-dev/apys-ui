<template>
  <div v-if="isLoading" class="loader"></div>
  <div v-else>
    <the-header></the-header>
    <router-view class="content" />
    <the-footer></the-footer>
  </div>
</template>

<script>
import TheHeader from '@/views/TheHeader.vue';
import TheFooter from './views/TheFooter.vue';
import { initContract, login, logout } from '@/near/utils';
import { mapActions } from 'vuex';
import axios from 'axios';

export default {
  name: 'App',

  components: { TheHeader, TheFooter },
  data: () => ({
    accountId: 'n/a',
    isLogged: false,
    login: () => login(),
    logout: () => logout(),
    isLoading: true,
  }),

  async mounted() {
    // Preload general info about tokens and strategies
    const response = await axios.get('http://localhost:3060/info');
    if (!response.data) {
      throw 'Can not preload initial data';
    }

    const metadata = response.data.metadata;

    const { accountId, walletConnection } = await initContract(metadata.apysContractId);
    console.log('accountId', accountId);
    this.accountId = accountId;
    this.walletConnection = walletConnection;
    this.isLogged = this.walletConnection.isSignedIn();

    // Set vaults
    this.initVaults(response.data.strategies);

    // Set balance tokens
    this.initTokens(response.data.tokens);

    // Load balances
    await this.loadBalances();

    // Load user shares
    const vaultsContractsIds = response.data.strategies.map((it) => it.contractId);
    await this.loadShares(vaultsContractsIds);

    // Load all user actions
    await this.loadUserActions();

    // Load user strategy state
    await this.loadStrategyState();

    // Change state to loaded
    this.isLoading = false;
  },
  methods: {
    ...mapActions(['loadBalances', 'initVaults', 'initTokens', 'loadUserActions', 'loadStrategyState', 'loadShares']),
  },
};
</script>

<style lang="scss">
.content {
  height: 100%;
}

.loader {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: url('/static/images/loading_spinner.gif') 50% 50% no-repeat rgb(249, 249, 249);
}
</style>
