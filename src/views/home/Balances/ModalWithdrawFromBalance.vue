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
      <div class="modalBalanceAmount">You have {{ $formatPrice(amount, true) }} {{ token.symbol }}</div>
      <div class="modalBalanceInput">
        <g-autonumeric v-model="modalBalanceAmount" />
        <span @click="maxAmount">Max</span>
      </div>
      <button :disabled="!canWithdraw" class="btn-bg" @click="withdraw">Withdraw</button>
    </template>
  </g-modal>
</template>

<script>
import { withdrawFt } from '@/near/utils';

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

    amount: {
      type: [String, Number],
      default: 0,
    },
  },

  data: () => ({
    modalBalanceAmount: null,
    canWithdraw: false,
  }),

  watch: {
    modalBalanceAmount(val) {
      const hasWithdrawBalance = Number(this.amount) > 0;
      const hasEnoughAmount = Number(val) > 0 && Number(val) <= this.amount;
      this.canWithdraw = hasWithdrawBalance && hasEnoughAmount;
    },
  },

  methods: {
    async withdraw() {
      let amount = 0;

      // Check that amount in the input same as the max amount
      const isPriceSame = this.$formatPrice(this.modalBalanceAmount, true) === this.$formatPrice(this.amount, true);
      if (isPriceSame) {
        amount = this.amount;
      } else {
        amount = this.modalBalanceAmount;
      }

      // Withdraw tokens
      await withdrawFt(this.token, amount);
    },
    closeModal() {
      this.$vfm.hide(this.nameModal);
    },
    maxAmount() {
      this.modalBalanceAmount = this.$formatPrice(this.amount, true);
    },
  },
};
</script>
