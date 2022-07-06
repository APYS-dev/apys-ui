<template>
  <VueFinalModal
    v-bind="$attrs"
    classes="vfm--modal"
    @before-close="tokenDropdownRef.closeDropdown()"
  >
    <div class="vfm--modal-container">
      <button
        type="button"
        class="vfm--modal-close"
        title="Close"
        @click="$emit('close')"
      ></button>

      <div class="vfm--modal-header">
        <h3>Withdraw</h3>
      </div>

      <div class="vfm--modal-content modal">
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

          <span>
            You will receive <b>~{{ receiveAmount }}</b>
            {{ currentToken.symbol }},

            <div class="rewards">
              including <b>~{{ receiveRewardAmount }}</b>
              {{ currentToken.symbol }} as rewards
            </div>
          </span>
        </div>
        <div class="modalBalanceFee">
          <div class="modalBalanceFee__title"><b>Includes fees:</b></div>
          <div class="modalBalanceFee__amount">Platform: 0%</div>
          <div class="modalBalanceFee__amount">
            Dex: {{ vaultMeta.dexFee }}%
          </div>
        </div>
        <button
          :disabled="!canWithdraw"
          class="btn-bg withdrawButton"
          @click="withdraw"
        >
          Withdraw
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import type {
  TokenMetaWithPrice,
  VaultMeta,
} from "@/network/models/InfoServerModels";
import type Big from "big.js";
import { computed, ref } from "vue";
import DropDown from "@/components/DropDown.vue";
import { useVaultStore } from "@/stores/vault";

// Define props
const props = defineProps<{
  vaultMeta: VaultMeta;
  balanceInDollars: Big;
  rewardInDollars: Big;
}>();

// Define data
const currentToken = ref<TokenMetaWithPrice>(props.vaultMeta.depositTokens[0]);

// Elements refs
const tokenDropdownRef = ref<HTMLDivElement | null>(null);

// Format data
const receiveAmount = computed(() => {
  return props.balanceInDollars.div(currentToken.value.price).toFixed(2);
});

const receiveRewardAmount = computed(() => {
  return props.rewardInDollars.div(currentToken.value.price).toFixed(2);
});

const canWithdraw = computed(() => {
  return props.balanceInDollars.plus(props.rewardInDollars).gt(0);
});

async function withdraw() {
  const { withdraw } = useVaultStore();

  await withdraw(props.vaultMeta.contractId, currentToken.value.contractId);
}
</script>

<style lang="scss" scoped>
.modal {
  width: 420px;
}

.modalBalanceInput {
  margin: 8px 0 0;

  .rewards {
    text-align: end;
  }

  span {
    padding: 0 0;
    text-transform: none;
    text-align: end;
  }

  display: flex;
  gap: 8px;

  .text {
    font-size: 14px;
    font-weight: 300;
  }

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

.withdrawButton {
  width: 100%;
}
</style>
