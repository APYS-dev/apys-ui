<template>
  <div class="vault-wrap">
    <div class="vault" @click="show = !show">
      <div class="vault__name-wrap">
        <div class="vault__logo">
          <img
            v-for="token in depositTokens"
            :key="token"
            :alt="token.symbol"
            :src="`/static/images/tokens/${token.symbol}.svg`"
          />
        </div>

        <div class="vault__name">
          {{ name }}
        </div>

        <button class="icon-info" @click.stop="showVaultModal"></button>
      </div>

      <div class="vault__dex">
        <span class="light-text">dex</span>
        <a :href="dexUrl" target="_blank">
          <img :src="`/static/images/dexes/${dex}.png`" alt="ref finance" />
        </a>
      </div>

      <div class="vault__tvl">
        <span class="light-text">tvl</span>
        <div class="amount">{{ $formatPrice(tvl) }}</div>
      </div>

      <div class="vault__apy">
        <div class="light-text">
          apy
          <button class="icon-info" @click.stop="showApyModal"></button>
        </div>

        <div class="amount">
          {{ $formatAndCalculateApy(apr) }}
          <button class="calculator" @click.stop="showCalcModal">
            <img alt="Calc" src="@/assets/img/calculator.png" />
          </button>
        </div>
      </div>

      <div :class="{ active: show }" class="vault__arrow">
        <img alt="↓" src="@/assets/img/arrow-down.png" />
      </div>
    </div>

    <vault-more :contract-id="contractId" :deposit-tokens="depositTokens" :show="show"></vault-more>
  </div>

  <g-modal
    :click-to-close="true"
    :is-show-close-button="true"
    :max-width="580"
    :name="$id('vault-info')"
    @close-modal="closeVaultModal"
  >
    <template #header>
      <h3 class="m-b-36">vault-info</h3>
    </template>

    <template #content>
      <div class="modal__inp-group"></div>
    </template>
  </g-modal>

  <g-modal
    :click-to-close="true"
    :is-show-close-button="true"
    :max-width="580"
    :name="$id('apy-info')"
    @close-modal="closeApyModal"
  >
    <template #header>
      <h3 class="m-b-36">Apy info</h3>
    </template>

    <template #content>
      <div class="modal__inp-group"></div>
    </template>
  </g-modal>

  <modal-calc :apr="apr" :name="$id('calc')"></modal-calc>
</template>

<script>
import ModalCalc from './ModalCalc.vue';
import VaultMore from './VaultMore.vue';

export default {
  name: 'Vault',

  components: { ModalCalc, VaultMore },

  props: {
    name: {
      type: String,
      required: true,
    },

    tvl: {
      type: [Number, String],
      required: false,
      default: 'n/a',
    },

    dex: {
      type: String,
      required: true,
    },

    dexUrl: {
      type: String,
      required: true,
    },

    apr: {
      type: [Number, String],
      required: true,
      default: 'n/a',
    },

    contractId: {
      type: [String],
      required: true,
    },

    depositTokens: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  data: () => ({
    show: false,
  }),

  methods: {
    showCalcModal() {
      this.$vfm.show(this.$id('calc'));
    },

    showVaultModal() {
      this.$vfm.show(this.$id('vault-info'));
    },

    closeVaultModal() {
      this.$vfm.hide(this.$id('vault-info'));
    },

    showApyModal() {
      this.$vfm.show(this.$id('apy-info'));
    },

    closeApyModal() {
      this.$vfm.hide(this.$id('apy-info'));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.vault-wrap {
  overflow: hidden;
  box-shadow: 0px -4px 50px rgba(47, 91, 96, 0.08);

  &:not(:first-child) {
    margin: 16px auto 0;
  }
}

.vault {
  padding: 16px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background-color: var(--background-color);
  border-radius: 4px;
  cursor: pointer;

  &__name-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__logo {
    display: flex;

    img {
      &:not(:last-child) {
        margin-right: -12px;
      }

      height: 30px;
    }
  }

  &__name {
    font-size: 14px;
    font-weight: 500;
  }

  &__dex,
  &__tvl,
  &__apy {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;

    .amount {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
    }

    .calculator img {
      width: 8px;
      height: 10px;
    }

    img {
      width: 17px;
    }

    button {
      width: 11px;
      height: 11px;
      font-size: 8px;
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
  }
}

.icon-info {
  display: inline-flex;
  cursor: pointer;
}
</style>
