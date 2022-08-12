<template>

    <div class="vault">
      <div class="vault__name-wrap">
        <div class="vault__logo">
          <img
            v-for="token in meta.depositTokens"
            :key="token.symbol"
            :alt="token.symbol"
            :src="`/static/icons/token/${token.symbol}.svg`"
          />
        </div>

        <div class="vault__name">
          {{ meta.name }}
        </div>
      </div>
      <div class="vault__data">
        <div class="vault__dex">
          <span class="light-text">dex</span>
          <a :href="meta.dexUrl" target="_blank">
            <img :src="`/static/icons/dex/${meta.dex}.svg`" :alt="meta.dex" />
          </a>
        </div>

        <div class="vault__bonus">
          <div class="light-text">
            +rewards
            <button
              class="icon-info"
              @click.stop="showRewardsInfoModal"
            ></button>
          </div>
          <div class="tokens">
            <img
              :alt="`${bonusToken.symbol}`"
              :src="`/static/icons/token/${bonusToken.symbol}.svg`"
            />
          </div>
        </div>

        <div class="vault__tvl">
          <span class="light-text">tvl</span>
          <div class="amount">{{ formattedTVL }}</div>
        </div>

        <div class="vault__apy">
          <div class="light-text">
            apy
            <button class="icon-info" @click.stop="showApyInfoModal"></button>
          </div>

          <div class="amount">
            {{ formattedAPY }}
            <button class="calculator" @click.stop="showApyCalculatorModal">
              <img alt="Calc" src="/static/icons/other/calculator.png" />
            </button>
          </div>
        </div>

        <div class="vault__status">
          <div v-if="meta.status === 'upcoming'" class="line line-position">
            coming
          </div>
        </div>
      </div>
    </div>

</template>

<script setup lang="ts">
import type { VaultMeta } from "@/network/models/InfoServerModels";
import { computed } from "vue";
import { formatPrice } from "@/utils/formatters";
import { aprToApy } from "@/utils/math";
import { $vfm } from "vue-final-modal";
import { useGeneralStore } from "@/stores/general";
import { useVaultStore } from "@/stores/vault";

const {
  metadata: { bonusToken },
} = useGeneralStore();

const { isBonusRewardsAvailable } = useVaultStore();

// Define props
const props = defineProps<{
  meta: VaultMeta;
}>();

// Format values
const formattedTVL = computed(() => {
  return formatPrice(props.meta.tvl.toNumber());
});

const formattedAPY = computed(() => {
  return `${props.meta.bonusApr
    .add(aprToApy(props.meta.apr, 365))
    .toFixed(2)}%`;
});

// Buttons
function showApyInfoModal() {
  $vfm.show({
    component: "ModalApyInfo",
    bind: {},
    on: {
      close() {
        $vfm.hideAll();
      },
    },
  });
}

function showRewardsInfoModal() {
  $vfm.show({
    component: "ModalRewardsInfo",
    bind: {},
    on: {
      close() {
        $vfm.hideAll();
      },
    },
  });
}

function showApyCalculatorModal() {
  $vfm.show({
    component: "ModalApyCalculator",
    bind: {
      apr: props.meta.apr,
      bonusApr: props.meta.bonusApr,
    },
    on: {
      close() {
        $vfm.hideAll();
      },
    },
  });
}
</script>

<style lang="scss" scoped>
.vault {
  padding: 16px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background-color: var(--background-color);
  border-radius: 4px;
  position: relative;
  &__name-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 232px;
  }
  &__logo {
    display: flex;
    img {
      &:not(:last-child) {
        margin-right: -12px;
      }
      height: 31px;
      border: 3px solid #ffffff;
      border-radius: 20px;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 4px;
    }
  }
  &__name {
    font-size: 14px;
    font-weight: 500;
  }

  &__data {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  &__dex,
  &__tvl,
  &__bonus,
  &__apy {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 34px;
    gap: 4px;
    .amount {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      min-width: 72px;
    }
    .tokens {
      display: flex;
      flex-direction: row;
      gap: 4px;
    }
    .calculator img {
      width: 8px;
      height: 10px;
    }
    img {
      width: 19.2px;
    }
    button {
      width: 11px;
      height: 11px;
      font-size: 8px;
    }
  }
  &__status {
    display: flex;
    min-height: 34px;
    min-width: 40px;
    .line {
      color: var(--color-text);
      font-weight: 700;
      background: #f7c945;
      font-size: 16px;
      line-height: 24px;
    }
    .line-position {
      position: absolute;
      right: 0;
      top: 0;
      padding: 0 2em;
      transform-origin: left bottom;
      transform: translate(29.29%, -100%) rotate(45deg);
      text-indent: 0;
    }
  }
  &__arrow {
    display: flex;
    align-items: center;
    width: 21px;
    transition: all 0.3s;
    cursor: pointer;
    &.active {
      transform: rotate(180deg);
    }
  }
  .light-text {
    font-size: 11px;
    color: rgba(0, 0, 0, 0.3);
    text-transform: uppercase;
    height: 14px;
  }
}

.icon-info {
  display: inline-flex;
  cursor: pointer;
}
.modal {
  &__inp-group {
    &__paragraph {
      margin-bottom: 5px;
    }
    &__topic {
      margin-top: 8px;
      font-size: larger;
      font-weight: bolder;
    }
  }
}

@media screen and(max-width:500px) {
  .vault {
    display: flex;
    flex-direction: column;

    &__data {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 25px;
    }

    &__bonus {
      display: none;
    }

    &__dex,
    &__tvl,
    &__apy {
      .calculator {
        width: 14px;
        height: 14px;
        img {
          margin-left: 10px;
          width: 16px;
          height: 16px;
        }
      }
      .amount {
        height: 20px;
      }
    }
    &__tvl {
      margin-left: 5%;
    }
  }
}
</style>
