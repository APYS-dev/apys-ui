<template>
  <footer>
    <a
      href="https://twitter.com/apyswap"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="/static/icons/social/twitter.png" alt="twitter" />
    </a>
    <a href="https://t.me/apyswapcom" target="_blank" rel="noopener noreferrer">
      <img src="/static/icons/social/telegram.png" alt="telegram" />
    </a>
    <a
      href="https://apys.medium.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="/static/icons/social/medium.png" alt="medium" />
    </a>
    <a
      href="https://github.com/APYS-dev"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="/static/icons/social/github.png" alt="github" />
    </a>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TheFooter",
});
</script>

<style lang="scss" scoped>
footer {
  margin: 12px auto;
  display: flex;
  justify-content: center;
  text-align: center;
  gap: 16px;

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 38px;
    height: 38px;
  }

  img {
    width: 20px;
  }
}
</style>
