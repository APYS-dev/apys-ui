<template>
  <g-modal
    :name="nameModal"
    :click-to-close="true"
    :is-show-close-button="true"
    :min-width="363"
    @close-modal="closeModal"
  >
    <template #header>
      <h3>Withdraw {{ name }}</h3>
    </template>

    <template #content>
      <div class="modalBalanceAmount">You have {{ $formatPrice(amount, true) }} {{ name }}</div>
      <div class="modalBalanceInput">
        <g-autonumeric v-model="modalBalanceAmount" />
        <span>Max</span>
      </div>
      <button class="btn-bg">Withdraw</button>
    </template>
  </g-modal>
</template>

<script>
export default {
  name: 'ModalWithdrawFromBalance',

  props: {
    name: {
      type: String,
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
    closeModal() {
      this.$vfm.hide(this.nameModal);
    },
  },
};
</script>
