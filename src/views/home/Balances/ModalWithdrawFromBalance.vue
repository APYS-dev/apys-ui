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
      // Check amount is enough for deposit or not
      const hasWithdrawBalance = Number(this.amount) > 0;
      const hasEnoughAmount = Number(val) > 0 && Number(val) <= this.amount;
      this.canWithdraw = hasWithdrawBalance && hasEnoughAmount;

      // Check that inputted amount the same as max
      this.useMaxAmount = Number(this.amount).toFixed(2) === Number(val).toFixed(2);
    },
  },

  methods: {
    async withdraw() {
      const withdrawAmount = this.useMaxAmount ? this.amount : this.modalBalanceAmount;

      // Withdraw tokens
      await withdrawFt(this.token, withdrawAmount);
    },
    closeModal() {
      this.$vfm.hide(this.nameModal);
    },
    maxAmount() {
      const amount = Number(this.amount);

      // Skip if amount is zero
      if (amount === 0) {
        return;
      }

      // Set amount to max
      this.modalBalanceAmount = this.$formatPrice(amount, true);
    },
  },
};
</script>
