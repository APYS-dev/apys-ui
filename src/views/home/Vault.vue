<template>
  <div class="vault-wrap">
    <div class="vault" @click="show = !show">
      <div class="vault__name-wrap">
        <div class="vault__logo">
          <img v-for="logo in logoesUrl" :key="logo" :src="logo" :alt="logo" />
        </div>

        <div class="vault__name">
          {{ name }}
        </div>

        <button class="icon-info" @click.stop="showVaultModal"></button>
      </div>

      <div class="vault__dex">
        <span class="light-text">dex</span>
        <img src="@/assets/img/dexes/ref-finance.png" alt="ref finance" />
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
          {{ $formatIntegerPercent(apy) }}
          <button class="calculator" @click.stop="showCalcModal">
            <img src="@/assets/img/calculator.png" alt="Calc" />
          </button>
        </div>
      </div>

      <div :class="{ active: show }" class="vault__arrow">
        <img src="@/assets/img/arrow-down.png" alt="↓" />
      </div>
    </div>

    <div class="vault-more-wrap" :class="{ active: show }">
      <div class="vault-more">
        <div>
          <h3 class="vault-more__header">Deposited</h3>

          <div class="vault-more__body">
            <div>
              <div class="amount">{{ $formatPrice(1000, true) }}</div>
              <div class="price">{{ $formatPrice(1000) }}</div>
            </div>
            <div class="currency">USDT</div>
          </div>
        </div>

        <div>
          <h3 class="vault-more__header">Rewards</h3>

          <div class="vault-more__body">
            <div>
              <div class="amount">{{ $formatPrice(45, true) }}</div>
              <div class="price">{{ $formatPrice(45) }}</div>
            </div>
            <div class="currency">USDT</div>
          </div>
        </div>

        <div class="vault-more__btns">
          <button class="btn-bg">Desposit</button>
          <button class="btn-border">Withdraw</button>
        </div>
      </div>
    </div>
  </div>

  <g-modal
    :name="$id('vault-info')"
    :click-to-close="true"
    :is-show-close-button="true"
    :width="580"
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
    :name="$id('apy-info')"
    :click-to-close="true"
    :is-show-close-button="true"
    :width="580"
    @close-modal="closeApyModal"
  >
    <template #header>
      <h3 class="m-b-36">Apy info</h3>
    </template>

    <template #content>
      <div class="modal__inp-group"></div>
    </template>
  </g-modal>

  <g-modal
    :name="$id('calc')"
    :click-to-close="true"
    :is-show-close-button="true"
    :width="580"
    @close-modal="closeCalcModal"
  >
    <template #header>
      <h3 class="m-b-36">Calculating rewards</h3>
    </template>

    <template #content>
      <div class="modal__inp-group">
        Stake
        <g-autonumeric v-model="amountToStake" />
        <span style="margin-left: -50px; color: #000">USDT</span>
      </div>
    </template>
  </g-modal>
</template>

<script>
import GModal from '@/components/G-modal.vue';
import GAutonumeric from '@/components/G-autonumeric.vue';

export default {
  name: 'Vault',

  components: { GModal, GAutonumeric },

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

    apy: {
      type: [Number, String],
      required: false,
      default: 'n/a',
    },

    logoesUrl: {
      type: Array,
      required: false,
      default: () => ['/static/images/tokens/defaultCoin.png'],
    },
  },

  data: () => ({
    show: false,
    amountToStake: 0,
  }),

  methods: {
    showCalcModal() {
      this.$vfm.show(this.$id('calc'));
    },

    closeCalcModal() {
      this.$vfm.hide(this.$id('calc'));
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
<style scoped lang="scss">
.vault-wrap {
  overflow: hidden;

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
      font-size: 12px;
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
    font-size: 9px;
    color: rgba(0, 0, 0, 0.3);
    text-transform: uppercase;
  }
}

.vault-more-wrap {
  overflow: hidden;
  max-height: 0;
  transition: all 0.3s ease-out;

  &.active {
    max-height: 120px;
  }
}

.vault-more {
  padding: 16px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--background-color);
  border-top: 1px solid rgba(13, 13, 13, 0.1);
  border-radius: 4px;

  & > div {
    flex: 0;

    &:not(.vault-more__btns) {
      flex: 1;
    }

    &:first-child {
      margin-right: 24px;
      border-right: 1px solid rgba(13, 13, 13, 0.1);
    }
  }

  &__header {
    font-size: 11px;
    color: rgba(13, 13, 13, 0.4);
  }

  &__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .amount {
    margin: 8px 0;
    font-size: 24px;
    font-weight: 500;
    color: var(--color-main);
  }

  .currency {
    margin-right: 12px;
    font-size: 12px;
    color: rgba(13, 13, 13, 0.3);
  }

  &__btns {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.icon-info {
  display: inline-flex;
  cursor: pointer;
}
</style>
