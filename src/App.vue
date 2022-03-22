<template>
  <div v-if="isLoading" class="loader">
  </div>
  <div v-else>
    <the-header></the-header>
    <router-view class="content" />
    <the-footer></the-footer>
  </div>
</template>

<script>
import TheHeader from '@/views/TheHeader.vue';
import TheFooter from './views/TheFooter.vue';
import {login, logout} from "@/near/utils";
import {mapActions} from "vuex";

export default {
  name: 'App',

  components: { TheHeader, TheFooter },

  async mounted() {
    await this.loadBalances();
    this.isLoading = false;
  },
  data: () => ({
    accountId: window.walletConnection.getAccountId(),
    isLogged: window.walletConnection.isSignedIn(),
    login: () => login(),
    logout: () => logout(),
    isLoading: true,
  }),
  methods: {
    ...mapActions(['loadBalances']),
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
  background: url('/static/images/loading_spinner.gif')
  50% 50% no-repeat rgb(249,249,249);
}
</style>
