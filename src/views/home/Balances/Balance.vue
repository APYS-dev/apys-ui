<template>
  <div class="balance">
    <img :alt="token.symbol" :src="`/static/images/tokens/${token.symbol}.svg`" />

    <div class="balance-amount">
      <p class="amount">{{ $root.isLogged ? $formatPrice(appBalance, true) : '–' }}</p>
      <p class="name">{{ $root.isLogged ? token.symbol : '–' }}</p>
    </div>

    <div class="balance-buttons">
      <button :disabled="!canWithdraw()" class="btn-small" @click="$vfm.show($id('withdrawFromBalance'))">
        Withdraw
      </button>
      <button :disabled="!canDeposit()" class="btn-small btn-bg-accent" @click="$vfm.show($id('depositFromBalance'))">
        Deposit
      </button>
    </div>
  </div>

  <modal-withdraw-from-balance
    :app-balance="appBalance"
    :name-modal="$id('withdrawFromBalance')"
    :token="token"
    :wallet-balance="walletBalance"
  ></modal-withdraw-from-balance>

  <modal-deposit-from-balance
    :app-balance="appBalance"
    :name-modal="$id('depositFromBalance')"
    :token="token"
    :wallet-balance="walletBalance"
  ></modal-deposit-from-balance>
</template>

<script>
import ModalDepositFromBalance from './ModalDepositFromBalance.vue';
import ModalWithdrawFromBalance from './ModalWithdrawFromBalance.vue';

export default {
  name: 'Balance',

  components: { ModalWithdrawFromBalance, ModalDepositFromBalance },

  props: {
    token: {
      type: Object,
      required: true,
    },

    walletBalance: {
      type: String,
      default: '0',
    },

    appBalance: {
      type: String,
      default: '0',
    },
  },

  methods: {
    showWithdrawModal() {
      this.$vfm.show(this.$id('withdrawFromBalance'));
    },

    showDepositModal() {
      this.$vfm.show(this.$id('depositFromBalance'));
    },

    canDeposit() {
      return !!window.accountId;
    },

    canWithdraw() {
      return Number(this.appBalance) > 0;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
