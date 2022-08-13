<template>
  <div class="component-wrapper">
    <div class="stepper-wrapper">
      <div
        v-for="(task, index) in currentTasks"
        :key="index"
        class="stepper-item tooltip"
        :class="{ completed: index < currentStep }"
      >
        <div v-if="index === currentStep" class="progress-circle">
          <svg width="33" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="16" fill="#fff" />
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="#08aeea"
              stroke-width="3"
              stroke-dasharray="0 4"
              stroke-linecap="round"
              fill="#fff"
            />
          </svg>
        </div>
        <div v-else class="step-counter">
          <div class="circle" />
        </div>
        <VTooltip activator="parent" location="top">{{
          getTaskTooltip(task.type)
        }}</VTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import type {
  AccountProgress,
  ProgressTask,
} from "@/network/models/VaultModels";

interface Props {
  progress: AccountProgress;
}

const props = defineProps<Props>();

// Define tasks type
const isDepositTasks = computed(
  () => props.progress.deposit_tasks.filter((it) => !it.ready).length > 0
);
const isWithdrawTasks = computed(
  () => props.progress.withdraw_tasks.filter((it) => !it.ready).length > 0
);
const isOtherTasks = computed(
  () => props.progress.other_tasks.filter((it) => !it.ready).length > 0
);


// Get total steps
const totalSteps = computed(() => {
  if (isDepositTasks.value) {
    return props.progress.deposit_tasks.length;
  } else if (isWithdrawTasks.value) {
    return props.progress.withdraw_tasks.length;
  } else if (isOtherTasks.value) {
    return props.progress.other_tasks.length;
  }
  return 0;
});

// Get current step
const currentStep = computed(() => {
  if (isDepositTasks.value) {
    return (
      totalSteps.value -
      props.progress.deposit_tasks.filter((it) => !it.ready).length
    );
  } else if (isWithdrawTasks.value) {
    return (
      totalSteps.value -
      props.progress.withdraw_tasks.filter((it) => !it.ready).length
    );
  } else if (isOtherTasks.value) {
    return (
      totalSteps.value -
      props.progress.other_tasks.filter((it) => !it.ready).length
    );
  }
  return 0;
});

// Get current tasks
const currentTasks = computed(() => {
  if (isDepositTasks.value) {
    return props.progress.deposit_tasks;
  } else if (isWithdrawTasks.value) {
    return props.progress.withdraw_tasks;
  } else if (isOtherTasks.value) {
    return props.progress.other_tasks;
  }
  return [] as ProgressTask[];
});

// Get tooltip text
function getTaskTooltip(task: ProgressTask["type"]) {
  switch (task) {
    case "HalfSwap":
      return "Swap deposit token";
    case "AddLiquidity":
      return "Tokens to liquidity";
    case "Stake":
      return "Stake liquidity";
    case "RemoveLiquidity":
      return "Liquidity to tokens";
    case "Swap":
      return "Swap to the requested token";
    case "ExchangeWithdraw":
      return "Withdraw from DEX";
    case "ContractWithdraw":
      return "Withdraw to APYS";
    case "ExchangeDeposit":
      return "Deposit to DEX";
  }
}
</script>

<style lang="scss" scoped>
.stepper-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.stepper-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 12px;
  }
}

.stepper-item::before {
  position: absolute;
  content: "";
  border-bottom: 2px solid #ccc;
  width: 100%;
  top: 15px;
  left: -50%;
  z-index: 2;
}

.stepper-item::after {
  position: absolute;
  content: "";
  border-bottom: 2px solid #ccc;
  width: 100%;
  top: 15px;
  left: 50%;
  z-index: 2;
}

.stepper-item .step-counter {
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background: #fff;
  margin-bottom: 6px;
  border-radius: 50%;
  border: 2px solid #ccc;
}

.stepper-item.active {
  font-weight: bold;
}

.stepper-item.completed .step-counter {
  border-color: #08aeea;
}

.stepper-item.completed::after {
  position: absolute;
  content: "";
  border-bottom: 2px solid #08aeea;
  width: 100%;
  top: 15px;
  left: 50%;
  z-index: 3;
}

.stepper-item:first-child::before {
  content: none;
}

.stepper-item:last-child::after {
  content: none;
}

.circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
}

.stepper-item.completed .circle {
  background: #08aeea;
}

.progress-circle {
  z-index: 3;
}

.progress-circle > svg {
  animation: circle 6s linear infinite;
}

@keyframes circle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
