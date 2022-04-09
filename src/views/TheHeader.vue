<template>
  <header class="container">
    <router-link to="/">
      <img class="logo" src="@/assets/img/logo.svg" alt="Apys" />
    </router-link>

    <button v-if="$root.isLogged" class="btn-big btn-border" @click="$root.logout">logout</button>
    <button v-else class="btn-big btn-bg" @click="$root.login">Connect wallet</button>
  </header>
</template>

<script>
export default {
  name: 'TheHeader',
};
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
