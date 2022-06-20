<template>
  <g-modal
    :click-to-close="true"
    :is-show-close-button="true"
    :min-width="363"
    :name="nameModal"
    @close-modal="closeModal"
  >
    <template #header>
      <h3>Withdraw {{ token.symbol }}</h3>
    </template>

    <template #content>
      <div class="modalBalanceAmount">You have {{ $formatPrice(appBalance, true) }} {{ token.symbol }}</div>
      <div class="modalBalanceInput">
        <g-autonumeric v-model="modalBalanceAmount" />
        <span @click="maxAmount">Max</span>
      </div>
      <button :disabled="!canWithdraw" class="btn-bg" @click="withdraw">Withdraw</button>
    </template>
  </g-modal>
</template>

<script>
import {toUnits, withdrawFt} from '@/near/utils';

export default {
  name: 'ModalWithdrawFromBalance',

  props: {
    token: {
      type: Object,
      required: true,
    },

    nameModal: {
      type: String,
      required: true,
    },

    appBalance: {
      type: String,
      default: '0',
    },

    walletBalance: {
      type: String,
      default: '0',
    },

    appRawBalance: {
      type: String,
      default: '0',
    },
  },

  data: () => ({
    modalBalanceAmount: null,
    canWithdraw: false,
    useMaxAmount: true,
  }),

  watch: {
    modalBalanceAmount(val) {
      // Check appBalance is enough for deposit or not
      const hasWithdrawBalance = Number(this.appBalance) > 0;
      const hasEnoughAmount = Number(val) > 0 && Number(val) <= this.appBalance;
      this.canWithdraw = hasWithdrawBalance && hasEnoughAmount;

      // Check that inputted appBalance the same as max
      this.useMaxAmount = Number(this.appBalance).toFixed(2) === Number(val).toFixed(2);
    },
  },

  methods: {
    async withdraw() {
      const withdrawAmount = this.useMaxAmount ? this.appRawBalance : toUnits(this.modalBalanceAmount, this.token.decimals);

      // Withdraw tokens
      await withdrawFt(this.token, withdrawAmount, this.walletBalance, this.appBalance);
    },
    closeModal() {
      this.$vfm.hide(this.nameModal);
    },
    maxAmount() {
      const amount = Number(this.appBalance);

      // Skip if appBalance is zero
      if (amount === 0) {
        return;
      }

      // Set appBalance to max
      this.modalBalanceAmount = this.$formatPrice(amount, true);
    },
  },
};
</script>
