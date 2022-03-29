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
      <button class="btn-bg" @click="withdraw">Withdraw</button>
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
    modalBalanceAmount: 0,
  }),

  methods: {
    async withdraw() {
      await withdrawFt(this.token, this.modalBalanceAmount);
    },
    closeModal() {
      this.$vfm.hide(this.nameModal);
    },
    maxAmount() {
      this.modalBalanceAmount = this.amount;
    },
  },
};
</script>
