<template>
  <div :class="{ active: true }" class="vault-more-wrap">
    <div class="vault-more">
      <div>
        <h3 class="vault-more__header">Deposited</h3>

        <div class="vault-more__body">
          <ContentLoader
            v-if="isShowBalanceLoader"
            height="29"
            viewBox="0 0 100 29"
            :speed="2"
            primaryColor="#f3f3f3"
            secondaryColor="#ecebeb"
          >
            <rect x="0" y="10" rx="3" ry="3" width="100" height="29" />
          </ContentLoader>
          <div v-else class="amount">
            {{ isShowBalance ? formattedBalance : "–" }}
          </div>
        </div>
      </div>

      <div>
        <h3 class="vault-more__header">
          +Rewards
          <span class="light-text">(coming soon)</span>
        </h3>

        <div class="vault-more__bonus-body">
          <div>
            <template v-for="token in vault.meta.rewardTokens" :key="token">
              <div class="token-balance">
                <img :alt="token" :src="`/static/icons/token/${token}.svg`" />
                <div class="token-amount">{{ "–" }}</div>
              </div>
            </template>
          </div>
          <button
            v-if="isSignedIn"
            :disabled="true"
            class="btn-small btn-border"
          >
            Claim
          </button>
        </div>
      </div>

      <div>
        <h3 class="vault-more__header">Rewards</h3>

        <div class="vault-more__body">
          <ContentLoader
            v-if="isShowBalanceLoader"
            height="29"
            viewBox="0 0 100 29"
            :speed="2"
            primaryColor="#f3f3f3"
            secondaryColor="#ecebeb"
          >
            <rect x="0" y="10" rx="3" ry="3" width="100" height="29" />
          </ContentLoader>
          <div v-else class="amount">
            {{ isShowBalance ? formattedRewardBalance : "–" }}
          </div>
          <!--          <div class="amount__plus">(+$0.0001)</div>-->
          <!--          <div v-if="isShowCounter()" class="amount__plus">-->
          <!--            <vue3-autocounter-->
          <!--              ref="counter"-->
          <!--              :autoinit="false"-->
          <!--              :decimals="counterDecimals"-->
          <!--              :duration="counterDuration"-->
          <!--              :end-amount="endAmount"-->
          <!--              :start-amount="startAmount"-->
          <!--              decimal-separator="."-->
          <!--              prefix="+"-->
          <!--              separator=","-->
          <!--              @finished="startCounter"-->
          <!--            />-->
          <!--          </div>-->
        </div>
      </div>

      <template v-if="vault.isProcessing">
        <StepsProgressBar :progress="vault.progress" />
      </template>
      <button v-else-if="!isSignedIn" class="btn-bg" @click="connectWallet">
        Connect wallet
      </button>
      <ContentLoader
        v-else-if="isShowControlLoader"
        height="73"
        viewBox="0 0 138 73"
        :speed="2"
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
      >
        <rect x="0" y="0" rx="0" ry="0" width="138" height="32" />
        <rect x="0" y="41" rx="0" ry="0" width="138" height="32" />
      </ContentLoader>
      <div v-else class="vault-more__btns">
        <button
          :disabled="!isDepositAvailable"
          class="btn-bg"
          @click="showDepositModal"
        >
          Deposit
        </button>
        <button
          :disabled="!isWithdrawAvailable"
          class="btn-border"
          @click="showWithdrawModal"
        >
          Withdraw
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogger } from "vue-logger-plugin";
import { useAuthStore } from "@/stores/auth";
import type { Vault } from "@/stores/types";
import { computed, ref, watch } from "vue";
import { formatPrice } from "@/utils/formatters";
import { useVaultStore } from "@/stores/vault";
import { nearApi } from "@/network/api/NearApi";
import { useBalanceStore } from "@/stores/balance";
import Big from "big.js";
import { $vfm } from "vue-final-modal";
import { ContentLoader } from "vue-content-loader";
import StepsProgressBar from "@/components/vault/VueCardProgress.vue";

const logger = useLogger();

// Stores
const { isSignedIn } = useAuthStore();
const { fetchVaultBalance, fetchVaultProgress, checkVaultProcessing } =
  useVaultStore();

// Define props
const props = defineProps<{
  vault: Vault;
}>();

// Define states
const isAppBalanceLoaded = ref(false);
const isVaultBalanceLoaded = ref(false);
const isProgressLoaded = ref(false);
const isDepositAvailable = ref(false);

// Define computed data
const isWithdrawAvailable = computed(() => {
  return props.vault.balanceInDollars.gt(0);
});
const isShowBalance = computed(() => {
  return isSignedIn && props.vault.meta.status !== "upcoming";
});

// Start fetching balance
if (isSignedIn) {
  // Fetch vault balance
  fetchVaultBalance(props.vault.meta.contractId)
    .then(() => {
      isVaultBalanceLoaded.value = true;
    })
    .catch((reason) => {
      isVaultBalanceLoaded.value = false;
      logger.error(
        `Failed to fetch vault balance for ${props.vault.meta.contractId}`,
        reason
      );
    });

  // Fetch vault progress
  fetchVaultProgress(props.vault.meta.contractId)
    .then(() => {
      isProgressLoaded.value = true;
    })
    .catch((reason) => {
      isProgressLoaded.value = false;
      logger.error(
        `Failed to fetch vault progress for ${props.vault.meta.contractId}`,
        reason
      );
    });
}

// Check show loader or not
const isShowBalanceLoader = computed(() => {
  return !isVaultBalanceLoaded.value && isSignedIn;
});
const isShowControlLoader = computed(() => {
  return !isAppBalanceLoaded.value && !isProgressLoaded.value && isSignedIn;
});

// Format balances
const formattedBalance = computed(() => {
  return formatPrice(props.vault.balanceInDollars.toNumber());
});

const formattedRewardBalance = computed(() => {
  return formatPrice(props.vault.rewardInDollars.toNumber());
});

// Listen for balance store changes
const balanceStore = useBalanceStore();
watch(balanceStore.$state, async () => {
  // Check that balances are loaded for deposit tokens
  isAppBalanceLoaded.value = props.vault.meta.depositTokens
    .map((depositToken) =>
      balanceStore.checkAppBalanceLoadedForToken(depositToken.contractId)
    )
    .reduce((a, b) => a && b, true);

  // Check that deposit available
  for (const depositToken of props.vault.meta.depositTokens) {
    // Get token app balance
    const appBalance = balanceStore
      .getAppBalanceByToken(depositToken.contractId)
      .div(new Big(10).pow(depositToken.decimals));

    // Check if deposit available
    if (
      appBalance.gt(depositToken.minDepositAmount) &&
      props.vault.meta.status === "live"
    ) {
      isDepositAvailable.value = true;
      return;
    }
  }
});

// Start fetching data until processing is finished
const isDataUpdating = ref(false);
const isDataFetched = ref(false);
watch(
  () => props.vault.isProcessing,
  async (isProcessing) => {
    if (isProcessing && !isDataUpdating.value && !isDataFetched.value) {
      isDataUpdating.value = true;

      // Timeout to prevent multiple requests
      const timeout = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      // Wait for processing to finish
      const waitForProcessing = async (): Promise<void> => {
        // Fetch current progress states
        await fetchVaultProgress(props.vault.meta.contractId);

        // Check if processing is finished
        const isProcessing = checkVaultProcessing(props.vault.meta.contractId);

        // if not processing, then fetch updated balance
        if (!isProcessing) {
          return await fetchVaultBalance(props.vault.meta.contractId);
        }

        await timeout(750);
        return waitForProcessing();
      };

      await waitForProcessing()
        .then(() => {
          isDataFetched.value = true;
          isDataUpdating.value = false;
          console.log(
            `Finished fetching vault data for ${props.vault.meta.name}`
          );
        })
        .catch(console.error);
    }
  }
);

// Buttons
function connectWallet() {
  nearApi.wallet.requestSignIn();
}

function showDepositModal() {
  $vfm.show({
    component: "ModalDepositFromVault",
    bind: {
      vaultMeta: props.vault.meta,
    },
    on: {
      close() {
        $vfm.hideAll();
      },
    },
  });
}

function showWithdrawModal() {
  $vfm.show({
    component: "ModalWithdrawFromVault",
    bind: {
      vaultMeta: props.vault.meta,
      balanceInDollars: props.vault.balanceInDollars,
      rewardInDollars: props.vault.rewardInDollars,
    },
    on: {
      close() {
        $vfm.hideAll();
      },
    },
  });
}
</script>

<style lang="scss" scoped>
.progress {
  display: flex;
  align-items: center;
  height: 73px;
}

.vault-more-wrap {
  overflow: hidden;
  max-height: 0;
  transition: all 0.3s ease-out;

  &.active {
    max-height: 120px;
  }
}

.vault-more {
  padding: 16px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--background-color);
  border-top: 1px solid rgba(13, 13, 13, 0.1);
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;

  & > div {
    flex: 0;

    &:not(.vault-more__btns) {
      flex: 1;
    }

    &:first-child {
      margin-right: 24px;
      border-right: 1px solid rgba(13, 13, 13, 0.1);
    }

    &:nth-child(2) {
      margin-right: 24px;
      border-right: 1px solid rgba(13, 13, 13, 0.1);
    }
  }

  &__header {
    font-size: 11px;
    color: rgba(13, 13, 13, 0.4);

    .light-text {
      font-size: 11px;
      color: rgba(0, 0, 0, 0.3);
    }
  }

  &__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 46px;
  }

  &__bonus-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 24px;
    min-height: 46px;

    .token-balance {
      display: flex;
      flex-direction: row;
      gap: 8px;

      img {
        width: 19.2px;
      }

      .token-amount {
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.3);
      }
    }
  }

  .amount {
    margin: 8px 0;
    font-size: 24px;
    font-weight: 500;
    color: var(--color-main);

    &__plus {
      flex-grow: 1;
      margin: 0 8px 0 8px;
      color: var(--color-main-90);
      font-family: monospace;
      font-size: 0.8rem;
      align-self: end;
    }
  }

  .price {
    font-size: 12px;
    color: rgba(13, 13, 13, 0.3);
  }

  .currency {
    margin-right: 12px;
    font-size: 12px;
    color: rgba(13, 13, 13, 0.3);
  }

  &__btns {
    display: flex;
    flex-direction: column;
    gap: 8px;

    button {
      min-width: max-content;
    }
  }
}
</style>
