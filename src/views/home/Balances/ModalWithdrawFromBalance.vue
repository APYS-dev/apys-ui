<template>
  <g-modal :name="nameModal" :click-to-close="true" :is-show-close-button="true" :width="580" @close-modal="closeModal">
    <template #header>
      <h3>Withdraw {{ name }}</h3>
    </template>

    <template #content>
      <div class="amount">You have {{ $formatPrice(amount, true) }} {{ name }}</div>
      <div class="input">
        <g-autonumeric v-model="amountToWithdraw" />
        <span>Max</span>
      </div>
      <button class="btn-bg">Withdraw</button>
    </template>
  </g-modal>
</template>

<script>
import gModal from '@/components/G-modal.vue';
import GAutonumeric from '@/components/G-autonumeric.vue';

export default {
  name: 'ModalWithdrawFromBalance',

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
    amountToWithdraw: 0,
  }),

  methods: {
    closeModal() {
      this.$vfm.hide('withdraw');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
