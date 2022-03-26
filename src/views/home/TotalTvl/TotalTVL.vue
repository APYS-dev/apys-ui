<template>
  <div class="total-tvl">
    <img alt="tvl" src="@/assets/img/totalTvl.png" />
    <span class="total-tvl__text">Total TVL</span>
    <span class="total-tvl__count">{{ $formatPrice(totalTvl) }}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TotalTvl',
  data: () => ({
    totalTvl: 'n/a',
  }),

  computed: {
    ...mapGetters(['getVaults']),
  },

  mounted() {
    // Calculate total TVL
    const totalTvl = this.getVaults.map((vault) => vault.tvl).reduce((a, b) => a + b, 0);
    if (totalTvl > 0) {
      this.totalTvl = totalTvl.toFixed(2);
    }
  },

  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.total-tvl {
  margin-bottom: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  height: 55px;
  background-color: var(--background-color);
  box-shadow: 0px -4px 50px rgba(47, 91, 96, 0.08);
  border-radius: 4px;

  img {
    margin-right: 12px;
    width: 20px;
  }

  &__text {
    font-size: 14px;
    font-weight: 300;
  }

  &__count {
    margin-left: 12px;
    color: var(--color-main);
    font-size: 18px;
    font-weight: 500;
  }
}
</style>
