<template>
  <BasicModal
    :click-to-close="true"
    :is-show-close-button="true"
    :min-width="363"
    :name="modalName"
    @close-modal="closeModal"
  >
    <template #header>
      <h3>Withdraw {{ token.symbol }}</h3>
    </template>

    <template #content>
      <div class="modalBalanceAmount">
        You have {{ formattedBalance }} {{ token.symbol }}
      </div>
      <div class="modalBalanceInput">
        <AmountInputField
          v-model="currentAmount"
          :input-name="`${modalName}-input`"
        />
        <span @click="maxAmount">Max</span>
      </div>
      <button :disabled="!canWithdraw" class="btn-bg" @click="withdraw">
        Withdraw
      </button>
    </template>
  </BasicModal>
</template>

<script setup lang="ts">
import BasicModal from "@/components/basic/BasicModal.vue";
import type { TokenMeta } from "@/network/models/InfoServerModels";
import Big from "big.js";
import { $vfm } from "vue-final-modal";
import { computed, ref } from "vue";
import AmountInputField from "@/components/input/AmountInputField.vue";
import { formatAmount } from "@/utils/formatters";
import { useBalanceStore } from "@/stores/balance";

// Define props
const props = defineProps<{
  modalName: string;
  token: TokenMeta;
  balance: Big;
}>();

// Define data
const currentAmount = ref<string | null>(null);

// Format balance
const readableBalance = computed(() => {
  return props.balance.div(new Big(10).pow(props.token.decimals));
});

const formattedBalance = computed(() => {
  return formatAmount(props.balance, props.token);
});

// Watch for currentAmount changes
const canWithdraw = computed(() => {
  // Check that balance is enough for withdraw or not
  const hasWithdrawBalance = readableBalance.value.gt(0);
  const hasEnoughAmount =
    currentAmount.value !== null &&
    readableBalance.value.gte(Big(currentAmount.value));
  return hasWithdrawBalance && hasEnoughAmount;
});

// Buttons
function maxAmount() {
  currentAmount.value = formatAmount(props.balance, props.token);
}

function closeModal() {
  $vfm.hide(props.modalName);
}

async function withdraw() {
  const { withdraw } = useBalanceStore();

  // Check that currentAmount is not null
  if (currentAmount.value === null) {
    return;
  }

  // Check that currentAmount is max of balance
  const isMaxAmount =
    Big(currentAmount.value).toFixed(props.token.fractionDigits) ===
    readableBalance.value.toFixed(props.token.fractionDigits);

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
