<template>
  <g-modal
    :click-to-close="true"
    :is-show-close-button="true"
    :min-width="363"
    :name="nameModal"
    @close-modal="closeModal"
  >
    <template #header>
      <h3>Deposit {{ token.symbol }}</h3>
    </template>

    <template #content>
      <div class="modalBalanceAmount">You have {{ $formatPrice(walletBalance, true) }} {{ token.symbol }}</div>
      <div class="modalBalanceInput">
        <g-autonumeric v-model="modalBalanceAmount" />
        <span @click="maxAmount">Max</span>
      </div>
      <button :disabled="!canDeposit" class="btn-bg" @click="deposit">Deposit</button>
    </template>
  </g-modal>
</template>

<script>
import {depositFt, toUnits} from '@/near/utils';

export default {
  name: 'ModalDepositFromBalance',

  props: {
    token: {
      type: Object,
      required: true,
    },

    nameModal: {
      type: String,
      required: true,
    },

    walletBalance: {
      type: String,
      default: '0',
    },
    rawBalance: {
      type: String,
      default: '0',
    },
  },

  data: () => ({
    modalBalanceAmount: null,
    canDeposit: false,
    useMaxAmount: true,
  }),

  watch: {
    modalBalanceAmount(val) {
      // Check walletBalance is enough for deposit or not
      const hasDepositBalance = Number(this.walletBalance) > 0;
      const hasEnoughAmount = Number(val) > 0 && Number(val).toFixed(2) <= Number(this.walletBalance).toFixed(2);
      this.canDeposit = hasDepositBalance && hasEnoughAmount;

      // Check that inputted walletBalance the same as max
      this.useMaxAmount = Number(this.walletBalance).toFixed(2) === Number(val).toFixed(2);
    },
  },

  methods: {
    async deposit() {
      const depositAmount = this.useMaxAmount ? this.rawBalance : toUnits(this.modalBalanceAmount, this.token.decimals);
      // Deposit tokens
      await depositFt(this.token, depositAmount, this.rawBalance, this.appBalance);
    },
    closeModal() {
      this.$vfm.hide(this.nameModal);
    },
    maxAmount() {
      // Set max walletBalance flat to true
      this.useMaxAmount = true;

      // Skip if walletBalance is zero
      if (Number(this.walletBalance) === 0) {
        return;
      }

      // Set walletBalance to max
      this.modalBalanceAmount = this.walletBalance;
    },
  },
};
</script>
