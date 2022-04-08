<template>
  <g-modal
    :classes="'modalCalc'"
    :click-to-close="true"
    :is-show-close-button="true"
    :max-width="580"
    :name="name"
    @close-modal="closeCalcModal"
  >
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
          <template v-for="duration in durations" :key="duration.label">
            <button
              :class="[
                duration === currentDuration ? 'btn-bg' : 'btn-bg-light',
              ]"
              @click="changeDuration(duration)"
            >
              {{ duration.label }}
            </button>
          </template>
        </div>
      </div>

      <div class="modal__receive">
        Receive
        <div>
          <div class="modal__receive-amount">
            <span class="amount">{{ $formatPrice(getReceiveAmount()) }}</span>
            <span class="currency no-select">USDT</span>
          </div>

          <div class="modal__receive-apy">
            APY:
            <span class="amount">{{ apy }}</span>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      Calculated based on current rates. Compounding once daily. Rates are
      estimates provided for your convenience.
    </template>
  </g-modal>
</template>

<script>
import { aprToApy } from "@/near/utils";

export default {
  name: "ModalCalc",

  props: {
    name: {
      type: String,
      default: "calc",
    },
    apr: {
      type: [Number, String],
      required: true,
      default: "n/a",
    },
    apy: {
      type: [Number, String],
      required: true,
      default: "n/a",
    },
  },

  data: () => ({
    amountToStake: 0,
    durations: [],
    currentDuration: { label: "1 day", days: 1, apy: aprToApy(1, 1) },
  }),

  mounted() {
    this.durations = [
      { label: "7 days", days: 7, apy: aprToApy(this.apr, 7) },
      { label: "30 days", days: 30, apy: aprToApy(this.apr, 30) },
      { label: "6 month", days: 180, apy: aprToApy(this.apr, 180) },
      { label: "1 year", days: 365, apy: aprToApy(this.apr, 365) },
    ];

    this.currentDuration = this.durations[0];
  },

  methods: {
    closeCalcModal() {
      this.$vfm.hide(this.name);
    },
    changeDuration(duration) {
      this.currentDuration = duration;
    },
    getFormattedApy() {
      return `${this.currentDuration.apy.toFixed(2)}%`;
    },
    getReceiveAmount() {
      return this.amountToStake * (Math.pow(Number(this.apy.substring(0, this.apy.length - 1)) / 100 + 1, this.currentDuration.days / 365) - 1);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.modalCalc {
  display: flex;
  align-items: center;
  justify-content: center;

  .vfm--modal-container {
    padding-left: 0;
    padding-right: 0;
    width: 380px;

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
        font-family: "WorkSans", sans-serif;
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

    &__receive {
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
        font-weight: 400;

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
}
</style>
