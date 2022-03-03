<template>
  <div class="balance">
    <img :src="logoUrl" :alt="name" />

    <div class="balance-amount">
      <p class="amount">{{ $root.isLogged ? $formatPrice(amount, true) : '–' }}</p>
      <p class="name">{{ $root.isLogged ? name : '–' }}</p>
    </div>

    <div class="balance-buttons">
      <button class="btn-small" @click="$vfm.show($id('withdrawFromBalance'))">Withdraw</button>
      <button class="btn-small btn-bg-light" @click="$vfm.show($id('depositFromBalance'))">Deposit</button>
    </div>
  </div>

  <modal-withdraw-from-balance
    :name-modal="$id('withdrawFromBalance')"
    :name="name"
    :amount="amount"
  ></modal-withdraw-from-balance>

  <modal-deposit-from-balance
    :name-modal="$id('depositFromBalance')"
    :name="name"
    :amount="amount"
  ></modal-deposit-from-balance>
</template>

<script>
import ModalDepositFromBalance from './ModalDepositFromBalance.vue';
import ModalWithdrawFromBalance from './ModalWithdrawFromBalance.vue';

export default {
  name: 'Balance',

  components: { ModalWithdrawFromBalance, ModalDepositFromBalance },

  props: {
    name: {
      type: String,
      required: true,
    },

    amount: {
      type: [String, Number],
      default: '–',
    },

    logoUrl: {
      type: String,
      default: '/static/images/tokens/usdc.svg',
    },
  },

  methods: {
    showWithdrawModal() {
      this.$vfm.show(this.$id('withdrawFromBalance'));
    },

    showDepositModal() {
      this.$vfm.show(this.$id('depositFromBalance'));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
