<template>
  <div class="total-tvl">
    <img alt="tvl" src="/static/icons/other/totalTvl.png" />
    <span class="total-tvl__text">Total TVL</span>
    <span class="total-tvl__count">{{ getFormattedTvl() }}</span>
  </div>
</template>

<script>
import { defineComponent, watch } from "vue";
import { useGeneralStore } from "@/stores/general";
import Big from "big.js";
import { formatPrice } from "@/utils/formatters";

export default defineComponent({
  data: () => ({
    totalTvl: new Big(0),
  }),

  mounted() {
    // Get general store
    const generalStore = useGeneralStore();

    // Listen for general store changes
    watch(generalStore.$state, (state) => {
      if (this.totalTvl !== state.totalTvl) {
        this.totalTvl = state.totalTvl;
      }
    });
  },

  methods: {
    getFormattedTvl() {
      return formatPrice(this.totalTvl.toNumber());
    },
  },
});
</script>

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
