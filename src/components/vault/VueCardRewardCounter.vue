<template>
  <div class="amount__plus">
    <Vue3Autocounter
      ref="counterRef"
      :autoinit="false"
      :decimals="6"
      :duration="counterDuration"
      :end-amount="endAmount"
      :start-amount="startAmount"
      decimal-separator="."
      prefix="+$"
      separator=","
      @finished="startCounter"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import moment from "moment";
import type Big from "big.js";
import type Vue3Autocounter from "vue3-autocounter";

const SECONDS_IN_YEAR = 31536000;

// Define props
const props = defineProps<{
  lastRewardTime: Big;
  balanceInDollars: Big;
  rewardInDollars: Big;
  apr: Big;
}>();

// Define data
const startAmount = ref(0);
const endAmount = ref(0);
const counterDuration = ref(7200); // two hours

// Elements refs
const counterRef = ref<typeof Vue3Autocounter | null>(null);

onMounted(async () => {
  await startCounter();
});

const startCounter = async () => {
  const currentRewardTime = moment.utc(
    Number(props.lastRewardTime.toString().substr(0, 13))
  );
  const secondsFromLastReward = moment.utc().diff(currentRewardTime, "seconds");

  const oneYearProfit = props.balanceInDollars
    .plus(props.rewardInDollars)
    .mul(props.apr)
    .div(100);
  const oneSecondProfit = oneYearProfit.div(SECONDS_IN_YEAR);

  const profitFromLastReward = oneSecondProfit.mul(secondsFromLastReward);

  startAmount.value = profitFromLastReward.toNumber();
  endAmount.value = profitFromLastReward
    .add(oneSecondProfit.mul(counterDuration.value))
    .toNumber();

  setTimeout(() => {
    counterRef.value?.start();
  }, 500);
};
</script>

<style lang="scss" scoped>
.amount {
  margin-top: 8px;
  font-size: 24px;
  font-weight: 500;
  color: var(--color-main);

  &__plus {
    color: var(--color-main-90);
    font-family: monospace;
    font-size: 0.8rem;
    position: absolute;
    margin: 36px 0 0 8px;
  }
}
</style>
