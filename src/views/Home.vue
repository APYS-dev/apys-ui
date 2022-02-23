<template>
  <div class="container">
    <main>
      <div class="col-4 col-md-6 col-sm-12">
        <total-tvl></total-tvl>
        <balances></balances>
      </div>
      <div class="col-8 col-md-12">
        <vaults></vaults>
      </div>
    </main>
  </div>
</template>
<script>
import TotalTvl from '@/views/home/TotalTVL.vue';
import Balances from '@/views/home/Balances.vue';
import Vaults from '@/views/home/Vaults.vue';

export default {
  name: 'Home',

  components: { TotalTvl, Balances, Vaults },
};
</script>

<style lang="scss" scoped>
main {
  margin-left: -8px;
  margin-right: -8px;
  display: flex;
  flex-wrap: wrap;
  row-gap: 12px;

  & > div {
    min-width: 320px;
  }
}
</style>
