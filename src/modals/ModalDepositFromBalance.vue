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
        <h3>Deposit {{ token.symbol }}</h3>
      </div>

      <div class="vfm--modal-content">
        <div class="modalBalanceAmount">
          You have {{ formattedBalance }} {{ token.symbol }}
        </div>
        <div class="modalBalanceInput">
          <AmountInputField
            v-model="currentAmountRaw"
            input-name="depositFromBalanceInput"
          />
          <span @click="maxAmount">Max</span>
        </div>
        <button :disabled="!canDeposit" class="btn-bg" @click="deposit">
          Deposit
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import type { TokenMeta } from "@/network/models/InfoServerModels";
import Big from "big.js";
import { computed, ref } from "vue";
import AmountInputField from "@/components/input/AmountInputField.vue";
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
const canDeposit = computed(() => {
  // Check that balance is enough for deposit or not
  const hasDepositBalance = readableBalance.value.gt(0);

  const hasEnoughAmount =
    currentAmount.value.gt(0) &&
    readableBalance.value.gte(Big(currentAmount.value));

  return hasDepositBalance && hasEnoughAmount;
});

// Buttons
function maxAmount() {
  currentAmountRaw.value = formattedBalance.value;
}

async function deposit() {
  const { deposit } = useBalanceStore();

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

  await deposit(props.token.contractId, depositAmount.toFixed());
}
</script>

<style lang="scss" scoped>
.modal {
  width: 320px;
}
</style>
