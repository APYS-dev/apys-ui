<template>
  <VueFinalModal v-bind="$attrs" classes="vfm--modal">
    <div class="vfm--modal-container">
      <button
        type="button"
        class="vfm--modal-close"
        title="Close"
        @click="$emit('close')"
      ></button>

      <div class="vfm--modal-header modal">
        <h3>Withdraw {{ token.symbol }}</h3>
      </div>

      <div class="vfm--modal-content modal">
        <div class="modalBalanceAmount">
          You have {{ formattedBalance }} {{ token.symbol }}
        </div>
        <div class="modalBalanceInput">
          <AmountInputField
            v-model="currentAmountRaw"
            input-name="withdrawFromBalanceInput"
          />
          <span @click="maxAmount">Max</span>
        </div>
        <button :disabled="!canWithdraw" class="btn-bg" @click="withdraw">
          Withdraw
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import type { TokenMeta } from "@/network/models/InfoServerModels";
import Big from "big.js";
import { computed, ref } from "vue";
import { formatAmount } from "@/utils/formatters";
import { useBalanceStore } from "@/stores/balance";

// Define props
const props = defineProps<{
  token: TokenMeta;
  balance: Big;
}>();

// Define data
const currentAmountRaw = ref<string | null>(null);

// Format data
const readableBalance = computed(() => {
  return props.balance.div(new Big(10).pow(props.token.decimals));
});

const formattedBalance = computed(() => {
  return formatAmount(props.balance, props.token);
});

const currentAmount = computed(() => {
  return Big(currentAmountRaw.value ?? 0);
});

// Watch for currentAmount changes
const canWithdraw = computed(() => {
  // Check that balance is enough for withdraw or not
  const hasWithdrawBalance = readableBalance.value.gt(0);

  const hasEnoughAmount =
    currentAmount.value.gt(0) && readableBalance.value.gte(currentAmount.value);

  return hasWithdrawBalance && hasEnoughAmount;
});

// Buttons
function maxAmount() {
  currentAmountRaw.value = formattedBalance.value;
}

async function withdraw() {
  const { withdraw } = useBalanceStore();

  // Check that currentAmount is max of balance
  const isMaxAmount = currentAmountRaw.value === formattedBalance.value;

  // Deposit tokens
  let depositAmount: Big;
  if (isMaxAmount) {
    depositAmount = props.balance;
  } else {
    // Format currentAmount by decimals
    depositAmount = Big(currentAmount.value).mul(
      new Big(10).pow(props.token.decimals)
    );
  }

  await withdraw(props.token.contractId, depositAmount.toFixed());
}
</script>

<style lang="scss" scoped>
.modal {
  width: 320px;
}
</style>
