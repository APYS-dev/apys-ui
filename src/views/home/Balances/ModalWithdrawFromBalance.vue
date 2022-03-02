<template>
  <g-modal :name="nameModal" :click-to-close="true" :is-show-close-button="true" :width="580" @close-modal="closeModal">
    <template #header>
      <h3>Withdraw {{ name }}</h3>
    </template>

    <template #content>
      <div class="amountToWithdraw">You have {{ $formatPrice(amount, true) }} {{ name }}</div>
      <div class="inputToWithdraw">
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
<style lang="scss">
.vfm--modal-container {
  width: 363px;

  button.btn-bg {
    width: 100%;
  }
}

.amountToWithdraw {
  margin-top: 4px;
  font-size: 11px;
  font-weight: 300;
  color: rgba(13, 13, 13, 0.4);
  text-align: right;
}

.inputToWithdraw {
  margin: 8px 0 16px;
  display: flex;
  position: relative;

  input {
    padding: 8px 64px 8px 12px;
    width: 100%;
    flex: 1;
    border: 1px solid rgba(0, 0, 0, 0.06);
  }

  span {
    padding: 8px 16px;
    position: absolute;
    right: 0;
    color: var(--color-main);
    cursor: pointer;
    user-select: none;
  }
}
</style>
