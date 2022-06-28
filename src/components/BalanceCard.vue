<template>
  <div class="balance">
    <img
      :alt="balance.meta.symbol"
      :src="`/static/icons/token/${balance.meta.symbol}.svg`"
    />

    <ContentLoader
      v-if="isShowLoader"
      height="32"
      viewBox="0 0 160 32"
      :speed="2"
      primaryColor="#f3f3f3"
      secondaryColor="#ecebeb"
    >
      <rect x="0" y="0" rx="3" ry="3" width="80" height="14" />
      <rect x="0" y="18" rx="3" ry="3" width="60" height="12" />
    </ContentLoader>
    <div v-else class="balance-amount">
      <p class="amount">{{ isSignedIn ? formattedAppBalance : "-" }}</p>
      <p class="name">{{ balance.meta.symbol }}</p>
    </div>

    <ContentLoader
      v-if="isShowLoader"
      height="28"
      viewBox="0 0 148 28"
      :speed="2"
      primaryColor="#f3f3f3"
      secondaryColor="#ecebeb"
    >
      <rect x="0" y="0" rx="0" ry="0" width="76" height="32" />
      <rect x="80" y="0" rx="0" ry="0" width="68" height="32" />
    </ContentLoader>
    <div v-else class="balance-buttons">
      <button
        :disabled="!canWithdraw"
        class="btn-small"
        @click="showWithdrawModal"
      >
        Withdraw
      </button>
      <button
        :disabled="!canDeposit"
        class="btn-small btn-bg-accent"
        @click="showDepositModal"
      >
        Deposit
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ContentLoader } from "vue-content-loader";
import { useBalanceStore } from "@/stores/balance";
import type { TokenBalance } from "@/stores/types";
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { formatAmount } from "@/utils/formatters";
import { $vfm } from "vue-final-modal";
import { useLogger } from "vue-logger-plugin";

const logger = useLogger();

// Define props
const props = defineProps<{
  balance: TokenBalance;
}>();

// Define data
const isAppBalanceLoaded = ref(false);
const isWalletBalanceLoaded = ref(false);

// Auth store
const { isSignedIn } = useAuthStore();

// Start fetching balances
if (isSignedIn) {
  // Get balance store
  const { fetchWalletBalance, fetchAppBalance } = useBalanceStore();

  // Fetch app balance
  fetchAppBalance(props.balance.meta.contractId)
    .then((loaded) => {
      isAppBalanceLoaded.value = loaded;
    })
    .catch((reason) => {
      logger.error(
        `Failed to fetch app balance for ${props.balance.meta.contractId}`,
        reason
      );
    });

  // Fetch wallet balance
  fetchWalletBalance(props.balance.meta.contractId)
    .then((loaded) => {
      isWalletBalanceLoaded.value = loaded;
    })
    .catch((reason) => {
      logger.error(
        `Failed to fetch wallet balance for ${props.balance.meta.contractId}`,
        reason
      );
    });
}

// Check show loader or not
const isShowLoader = computed(() => {
  return (
    (!isAppBalanceLoaded.value || !isWalletBalanceLoaded.value) && isSignedIn
  );
});

// Format app balance
const formattedAppBalance = computed(() => {
  if (props.balance.appBalance) {
    return formatAmount(props.balance.appBalance, props.balance.meta);
  }
  return "-";
});

// Checkers for deposit and withdraw
const canDeposit = computed(() => {
  return (
    props.balance.walletBalance && props.balance.walletBalance.toNumber() > 0
  );
});
const canWithdraw = computed(() => {
  return props.balance.appBalance && props.balance.appBalance.toNumber() > 0;
});

// Buttons click handlers
function showWithdrawModal() {
  $vfm.show({
    component: "ModalWithdrawFromBalance",
    bind: {
      token: props.balance.meta,
      balance: props.balance.appBalance,
    },
    on: {
      close() {
        $vfm.hideAll();
      },
    },
  });
}

function showDepositModal() {
  $vfm.show({
    component: "ModalDepositFromBalance",
    bind: {
      token: props.balance.meta,
      balance: props.balance.walletBalance,
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
.balance {
  margin-bottom: 12px;
  padding-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  img {
    height: 100%;
    max-height: 26px;
  }

  &-amount {
    text-align: center;
    min-width: 36px;
    height: 32px;

    .amount {
      font-size: 14px;
      font-weight: bold;
    }

    .name {
      color: rgba(13, 13, 13, 0.4);
    }
  }

  &-buttons {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    gap: 4px;
  }
}
</style>
