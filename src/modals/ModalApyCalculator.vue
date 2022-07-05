<template>
  <VueFinalModal v-bind="$attrs" classes="vfm--modal modalCalc">
    <div class="vfm--modal-container">
      <button
        type="button"
        class="vfm--modal-close"
        title="Close"
        @click="$emit('close')"
      ></button>

      <div class="vfm--modal-header">
        <h3>Calculating rewards</h3>
      </div>

      <div class="vfm--modal-content">
        <div class="modal__input">
          <p>Stake</p>
          <AmountInputField
            v-model="currentAmountRaw"
            input-name="depositFromBalanceInput"
          />
          <span>USD</span>
        </div>

        <div class="modal__duration">
          For
          <div class="modal__duration-btns">
            <template v-for="duration in STAKE_DURATIONS" :key="duration.label">
              <button
                :class="[
                  duration.label === currentDuration.label
                    ? 'btn-bg'
                    : 'btn-bg-light',
                ]"
                @click="currentDuration = duration"
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
              <span class="amount">{{ formattedReceivedAmount }}</span>
            </div>

            <div class="modal__receive-apy">
              APY:
              <span class="amount">{{ formattedApy }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="vfm--modal-footer">
        Calculated based on current rates. Compounding once daily. Rates are
        estimates provided for your convenience.
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
// Define props
import Big from "big.js";
import { computed, ref } from "vue";
import { aprToApy, receivedAmountForApy } from "@/utils/math";
import { formatPrice } from "@/utils/formatters";

interface StakeDuration {
  label: string;
  days: number;
}

const STAKE_DURATIONS: StakeDuration[] = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "6 month", days: 180 },
  { label: "1 year", days: 365 },
];

// Define props
const props = defineProps<{
  apr: Big;
  bonusApr: Big;
}>();

// Define data
const currentDuration = ref(STAKE_DURATIONS[0]);
const currentAmountRaw = ref<string | null>(null);
const currentAmount = computed(() => {
  return Big(currentAmountRaw.value ?? 0);
});

// Format data
const formattedApy = computed(() => {
  return `${props.bonusApr
    .add(aprToApy(props.apr, currentDuration.value.days))
    .toFixed(2)}%`;
});

const formattedReceivedAmount = computed(() => {
  return formatPrice(
    receivedAmountForApy(
      currentAmount.value,
      props.apr,
      props.bonusApr,
      currentDuration.value.days
    )
  );
});
</script>

<style lang="scss" scoped>
.modal {
  width: 580px;
}

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
        width: 100%;

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
