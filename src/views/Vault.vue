<template>
  <div class="vault-wrap">
    <div class="vault">
      <div class="vault__logo">
        <img v-for="logo in logoesUrl" :key="logo" :src="logo" :alt="logo" />
      </div>

      <div class="vault__name">
        {{ name }}
      </div>

      <div class="vault__dex">
        <span class="light-text">dex</span>
        <div></div>
      </div>

      <div class="vault__tvl">
        <span class="light-text">tvl</span>
        <div class="amount">{{ $formatPrice(tvl) }}</div>
      </div>

      <div class="vault__apy">
        <span class="light-text">apy</span>
        <div class="amount">
          {{ $formatIntegerPercent(apy) }}
          <span @click="showModal">calc</span>
        </div>
      </div>

      <div class="vault__arrow" @click="show = !show"></div>
    </div>

    <div class="vault-more-wrap" :class="{ active: show }">
      <div class="vault-more row flex-v__center flex-h__between">
        <div class="col-4">
          <h3 class="vault-more__header">Deposited</h3>

          <div class="vault-more__body row flex-v__center">
            <div class="col-8">
              <div class="amount">0</div>
              <div class="price">{{ $formatPrice(0) }}</div>
            </div>
            <div class="col-4">USDT</div>
          </div>
        </div>

        <div class="col-4">
          <h3 class="vault-more__header">Rewards</h3>

          <div class="vault-more__body row flex-v__center">
            <div class="col-8">
              <div class="amount">0</div>
              <div class="price">{{ $formatPrice(0) }}</div>
            </div>
            <div class="col-4">USDT</div>
          </div>
        </div>

        <div class="col-3 vault-more__btns flex-direction__column">
          <button class="btn btn-bg">Desposit</button>
          <button class="btn btn-border">Withdraw</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Vault',

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
  }),

  methods: {
    showModal() {
      this.$vfm.show('calculate');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.vault-wrap {
  overflow: hidden;
}

.vault {
  margin: 16px auto 0;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background-color: #fff;
  border-radius: 3px;

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
    font-weight: bold;
  }

  &__dex {
    div {
      margin: 0 auto;
      width: 17px;
      height: 17px;
      background: #000;
      border-radius: 50%;
    }
  }

  &__arrow {
    width: 30px;
    height: 30px;
    background: linear-gradient(lightgray, white);
    cursor: pointer;
  }

  .light-text {
    font-size: 10px;
    color: #ccc;
    text-transform: uppercase;
  }
}

.vault-more-wrap {
  overflow: hidden;
  max-height: 0;
  transition: all 0.5s ease-out;

  &.active {
    max-height: 200px;
  }
}

.vault-more {
  padding: 12px 20px;
  background-color: #fff;
  border-top: 1px solid #ccc;
}
</style>
