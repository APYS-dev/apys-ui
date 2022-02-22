<template>
  <div class="container">
    <div class="row">
      <div class="col-4">
        <total-tvl></total-tvl>
        <balances></balances>
      </div>
      <div class="col-8">
        <vaults></vaults>
      </div>
    </div>
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
