<template>
  <g-modal :name="nameModal" :click-to-close="true" :is-show-close-button="true" :width="580" @close-modal="closeModal">
    <template #header>
      <h3>Deposit {{ name }}</h3>
    </template>

    <template #content>
      <div class="modalBalanceAmount">You have {{ $formatPrice(amount, true) }} {{ name }}</div>
      <div class="modalBalanceInput">
        <g-autonumeric v-model="modalBalanceAmount" />
        <span>Max</span>
      </div>
      <button class="btn-bg">Deposit</button>
    </template>
  </g-modal>
</template>

<script>
import gModal from '@/components/G-modal.vue';
import GAutonumeric from '@/components/G-autonumeric.vue';

export default {
  name: 'ModalDepositFromBalance',

  components: { gModal, GAutonumeric },

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
