<template>
  <BasicModal
    :click-to-close="true"
    :is-show-close-button="true"
    :min-width="500"
    :name="modalName"
    @close-modal="closeModal"
    @before-close="tokenDropdownRef.closeDropdown()"
  >
    <template #header>
      <h3>Deposit</h3>
    </template>

    <template #content>
      <div class="modalBalanceAmount">
        You have {{ formattedBalance }} {{ currentToken.symbol }}
      </div>
      <div class="modalBalanceInput">
        <DropDown
          ref="tokenDropdownRef"
          :name="`${vaultMeta.contractId}-dropdown`"
          position="bottom"
        >
          <div
            :key="currentToken.contractId"
            class="btn btn-bg-light dropdown-icon"
          >
            <img
              :alt="currentToken.symbol"
              :src="`/static/icons/token/${currentToken.symbol}.svg`"
            />
            {{ currentToken.symbol }}
          </div>

          <template #content>
            <ul class="list-dropbox">
              <template v-for="token in vaultMeta.depositTokens">
                <li
                  v-if="token.symbol !== currentToken.symbol"
                  :key="token.contractId"
                  @click="
                    currentToken = token;
                    tokenDropdownRef.closeDropdown();
                  "
                >
                  <img
                    :alt="token.symbol"
                    :src="`/static/icons/token/${token.symbol}.svg`"
                  />
                  <span>{{ token.symbol }}</span>
                </li>
              </template>
            </ul>
          </template>
        </DropDown>

        <AmountInputField
          v-model="currentAmountRaw"
          :input-name="`${modalName}-input`"
          :placeholder="`Min amount is ${currentToken.minDepositAmount}`"
        />
        <span @click="maxAmount">Max</span>
      </div>
      <button :disabled="!canDeposit" class="btn-bg" @click="deposit">
        Deposit
      </button>
    </template>
  </BasicModal>
</template>

<script setup lang="ts">
import BasicModal from "@/components/basic/BasicModal.vue";
import type {
  TokenMetaWithPrice,
  VaultMeta,
} from "@/network/models/InfoServerModels";
import Big from "big.js";
import { $vfm } from "vue-final-modal";
import { computed, ref } from "vue";
import AmountInputField from "@/components/input/AmountInputField.vue";
import { formatAmount } from "@/utils/formatters";
import { useBalanceStore } from "@/stores/balance";
import DropDown from "@/components/DropDown.vue";
import { useVaultStore } from "@/stores/vault";

// Get balance store
const { getAppBalanceByToken } = useBalanceStore();

// Define props
const props = defineProps<{
  modalName: string;
  vaultMeta: VaultMeta;
}>();

// Define data
const currentAmountRaw = ref<string | null>(null);
const currentToken = ref<TokenMetaWithPrice>(props.vaultMeta.depositTokens[0]);

// Elements refs
const tokenDropdownRef = ref<HTMLDivElement | null>(null);

// Format data
const readableBalance = computed(() => {
  return getAppBalanceByToken(currentToken.value.contractId).div(
    new Big(10).pow(currentToken.value.decimals)
  );
});

const formattedBalance = computed(() => {
  return formatAmount(
    getAppBalanceByToken(currentToken.value.contractId),
    currentToken.value
  );
});

const currentAmount = computed(() => {
  return Big(currentAmountRaw.value ?? 0);
});

const canDeposit = computed(() => {
  // Check that balance is enough for deposit or not
  const hasDepositBalance = readableBalance.value.gt(0);

  const hasEnoughAmount =
    currentAmount.value.gt(0) &&
    readableBalance.value.gte(Big(currentAmount.value));

  const isMoreThanMin = currentAmount.value.gte(
    currentToken.value.minDepositAmount
  );

  return hasDepositBalance && hasEnoughAmount && isMoreThanMin;
});

// Buttons
function maxAmount() {
  currentAmountRaw.value = formattedBalance.value;
}

function closeModal() {
  $vfm.hide(props.modalName);
}

async function deposit() {
  const { deposit } = useVaultStore();

  // Check that currentAmount is max of balance
  const isMaxAmount = currentAmountRaw.value === formattedBalance.value;

  // Deposit tokens
  let depositAmount: Big;
  if (isMaxAmount) {
    depositAmount = getAppBalanceByToken(currentToken.value.contractId);
  } else {
    // Format currentAmount by decimals
    depositAmount = Big(currentAmount.value).mul(
      new Big(10).pow(currentToken.value.decimals)
    );
  }

  await deposit(
    props.vaultMeta.contractId,
    currentToken.value.contractId,
    depositAmount.toFixed()
  );
}
</script>

<style lang="scss" scoped>
.modalBalanceInput {
  display: flex;
  gap: 8px;

  .btn-bg-light {
    padding: 4px 12px;
  }

  & + .btn-bg {
    width: 100%;
  }
}

.btn-bg-light,
.dropdown-box .list-dropbox li {
  padding: 8px 12px;
  display: flex;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;

  img {
    width: 26px;
  }
}
</style>
