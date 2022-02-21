<template>
  <header>
    <router-link to="/">
      <img class="logo" src="@/assets/img/logo.svg" alt="Apys" />
    </router-link>
    <button v-if="isLogged" class="btn-big btn-border">logout</button>
    <button v-else class="btn-border">Connect wallet</button>
  </header>
</template>

<script>
export default {
  name: 'TheHeader',

  data: () => ({
    isLogged: true,
  }),
};
</script>

<style lang="scss" scoped>
header {
  margin: 16px 92px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo {
    height: 26px;
    width: auto;
  }

  @media screen and (max-width: 1600px) {
    & {
      margin: 16px auto;
      padding: 0 24px;
      max-width: 90%;
    }
  }
}
</style>
