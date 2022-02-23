<template>
  <div class="total-tvl">
    <img src="@/assets/img/totalTvl.png" alt="tvl" />
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
