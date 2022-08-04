<template>
  <header class="container">
    <router-link to="/">
      <img class="logo" src="/static/images/logo.svg" alt="Apys" />
    </router-link>

    <button v-if="isSignedIn" class="btn-big btn-border" @click="signOut">
      Logout
    </button>
    <button v-else class="btn-big btn-bg" @click="signIn">
      Connect wallet
    </button>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuthStore } from "@/stores/auth";
import { nearApi } from "@/network/api/NearApi";

export default defineComponent({
  setup() {
    const auth = useAuthStore();

    return {
      isSignedIn: auth.isSignedIn,
    };
  },

  methods: {
    async signIn() {
      return await nearApi.wallet.requestSignIn();
    },

    signOut() {
      nearApi.wallet.signOut();

      // Go back to the home route
      this.$router.go(0);
    },
  },
});
</script>

<style lang="scss" scoped>
header {
  margin-top: 16px;
  margin-bottom: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo {
    height: 26px;
    width: auto;
  }

  @media screen and (min-width: 1600px) {
    &.container {
      margin-left: 92px;
      margin-right: 92px;
      max-width: 90%;
    }
  }
}
</style>
