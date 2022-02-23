<template>
  <g-modal :name="name" :click-to-close="true" :is-show-close-button="true" :width="580" @close-modal="closeCalcModal">
    <template #header>
      <h3>Calculating rewards</h3>
    </template>

    <template #content>
      <div class="modal__input">
        <p>Stake</p>
        <g-autonumeric v-model="amountToStake" />
        <span>USDT</span>
      </div>

      <div class="modal__duration">
        For
        <div class="modal__duration-btns">
          <button class="btn-bg-light">1 day</button>
          <button class="btn-bg">7 days</button>
          <button class="btn-bg-light">30 days</button>
          <button class="btn-bg-light">1 year</button>
        </div>
      </div>

      <div class="modal__recieve">
        Recieve
        <div>
          <div class="modal__recieve-amount">
            <span class="amount"> {{ $formatPrice(1032) }}</span>
            <span class="currency">USDT</span>
          </div>

          <div class="modal__recieve-apy">
            APY:
            <span class="amount">{{ $formatIntegerPercent(26) }}</span>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      Calculated based on current rates. Compounding once daily. Rates are estimates provided for your convenience.
    </template>
  </g-modal>
</template>

<script>
import GModal from '@/components/G-modal.vue';
import GAutonumeric from '@/components/G-autonumeric.vue';

export default {
  name: 'ModalCalc',

  components: { GModal, GAutonumeric },

  props: {
    name: {
      type: String,
      default: 'calc',
    },
  },

  data: () => ({
    amountToStake: 0,
  }),

  methods: {
    closeCalcModal() {
      this.$vfm.hide(this.name);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.vfm--modal-container {
  padding-left: 0;
  padding-right: 0;
  width: 365px;

  & > div {
    padding-left: 36px;
    padding-right: 36px;
  }
}

.vfm--modal-content {
  margin: 12px 0 20px;
}

.modal {
  &__input {
    position: relative;
    background: transparent;

    input {
      margin-top: 8px;
      padding: 8px 50px 8px 12px;
      width: 100%;
      font-family: 'WorkSans', sans-serif;
      background: transparent;
      border: 1px solid rgba(0, 0, 0, 0.06);
    }

    span {
      position: absolute;
      bottom: 8px;
      right: 16px;
      color: rgba(0, 0, 0, 0.3);
      pointer-events: none;
    }
  }

  &__duration {
    margin-top: 16px;

    &-btns {
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 4px;

      button {
        padding: 8px 16px;
        border-radius: 20px;

        &.btn-bg {
          font-weight: 500;
        }
      }
    }
  }

  &__recieve {
    margin-top: 24px;

    & > div {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 4px;
      flex-wrap: wrap;
    }

    &-amount {
      .amount {
        margin-right: 12px;
        font-size: 31px;
        color: var(--color-main);
      }

      .currency {
        font-size: 16px;
        color: rgba(13, 13, 13, 0.4);
      }
    }

    &-apy {
      font-size: 18px;

      .amount {
        color: var(--color-main);
      }
    }
  }
}

.vfm--modal-footer {
  margin-top: 28px;
  padding-top: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  font-size: 11px;
  font-weight: 300;
  color: rgba(13, 13, 13, 0.5);
  line-height: 21px;
}
</style>
