<template>
  <header>
    <router-link to="/">
      <img class="logo" src="@/assets/img/logo.svg" alt="Apys" />
    </router-link>

    <button v-if="$root.isLogged" class="btn-big btn-border">logout</button>
    <button v-else class="btn-big btn-bg">Connect wallet</button>
  </header>
</template>

<script>
export default {
  name: 'TheHeader',
};
</script>

<style lang="scss" scoped>
header {
  margin: 16px 92px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo {
    height: 26px;
    width: auto;
  }

  @media screen and (max-width: 1600px) {
    & {
      margin-right: auto;
      margin-right: auto;
      padding: 0 24px;
      width: 100%;
      max-width: 90%;
    }
  }
}
</style>
