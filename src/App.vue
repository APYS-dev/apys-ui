<template>
  <the-header></the-header>
  <router-view class="content" />
  <the-footer></the-footer>
</template>

<script>
import TheHeader from '@/views/TheHeader.vue';
import TheFooter from './views/TheFooter.vue';

export default {
  name: 'App',

  components: { TheHeader, TheFooter },
};
</script>

<style lang="scss">
.content {
  height: 100%;
}
</style>
