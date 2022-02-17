<template>
  <div class="total-tvl p-h-20 p-v-16">
    <span class="total-tvl__text">Total TVL</span>
    <span class="total-tvl__count">{{ $formatPrice(tvl) }}</span>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'TotalTvl',
  data: () => ({
    tvl: 'n/a',
  }),

  computed: {
    ...mapGetters(['getTotalTVL']),
  },

  mounted() {
    this.loadTotalTVL();
    this.tvl = this.getTotalTVL;
  },

  methods: {
    ...mapActions(['loadTotalTVL']),
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.total-tvl {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 3px;

  &__text {
    color: #ccc;
    font-size: 14px;
    font-weight: 300;
  }

  &__count {
    margin-left: 12px;
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
