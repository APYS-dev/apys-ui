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
      <div class="modalBalanceAmount">You have {{ $formatPrice(amount, true) }} {{ token.symbol }}</div>
      <div class="modalBalanceInput">
        <g-autonumeric v-model="modalBalanceAmount" />
        <span @click="maxAmount">Max</span>
      </div>
      <button :disabled="!canDeposit" class="btn-bg" @click="deposit">Deposit</button>
    </template>
  </g-modal>
</template>

<script>
import { depositFt } from '@/near/utils';

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

    amount: {
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
      // Check amount is enough for deposit or not
      const hasDepositBalance = Number(this.amount) > 0;
      const hasEnoughAmount = Number(val) > 0 && Number(val) <= this.amount;
      this.canDeposit = hasDepositBalance && hasEnoughAmount;

      // Check that inputted amount the same as max
      this.useMaxAmount = Number(this.amount).toFixed(2) === Number(val).toFixed(2);
    },
  },

  methods: {
    async deposit() {
      const depositAmount = this.useMaxAmount ? this.amount : this.modalBalanceAmount;

      // Deposit tokens
      await depositFt(this.token, depositAmount);
    },
    closeModal() {
      this.$vfm.hide(this.nameModal);
    },
    maxAmount() {
      // Set max amount flat to true
      this.useMaxAmount = true;

      // Skip if amount is zero
      if (Number(this.amount) === 0) {
        return;
      }

      // Set amount to max
      this.modalBalanceAmount = this.$formatPrice(this.amount, true);
    },
  },
};
</script>
