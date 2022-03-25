<template>
  <g-modal
    :name="nameModal"
    :click-to-close="true"
    :is-show-close-button="true"
    :min-width="363"
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
      <button class="btn-bg" @click="deposit">Deposit</button>
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
      type: [String],
      default: '0',
    },
  },

  data: () => ({
    modalBalanceAmount: 0,
  }),

  methods: {
    async deposit() {
      await depositFt(this.token, this.modalBalanceAmount);
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
