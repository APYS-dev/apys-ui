<template>
  <div class="container">
    <div class="row m-t-32">
      <div class="col-4">
        <total-tvl class="m-b-12"></total-tvl>
        <balances></balances>
      </div>
      <div class="col-8">
        <vaults></vaults>
      </div>
    </div>
  </div>
</template>
<script>
import TotalTvl from '@/views/TotalTVL.vue';
import Balances from '@/views/Balances.vue';
import Vaults from '@/views/Vaults.vue';

export default {
  components: { TotalTvl, Balances, Vaults },
};
</script>
