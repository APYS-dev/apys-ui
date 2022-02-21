<template>
  <footer>
    <a href="#" target="_blank" rel="noopener noreferrer">
      <img src="@/assets/img/social/twitter.png" alt="twitter" />
    </a>
    <a href="#" target="_blank" rel="noopener noreferrer">
      <img src="@/assets/img/social/telegram.png" alt="telegram" />
    </a>
    <a href="#" target="_blank" rel="noopener noreferrer">
      <img src="@/assets/img/social/medium.png" alt="medium" />
    </a>
    <a href="#" target="_blank" rel="noopener noreferrer">
      <img src="@/assets/img/social/github.png" alt="github" />
    </a>
    <a href="#" target="_blank" rel="noopener noreferrer">
      <img src="@/assets/img/social/doc.png" alt="doc" />
    </a>
  </footer>
</template>

<script>
export default {
  name: 'TheFooter',
};
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
