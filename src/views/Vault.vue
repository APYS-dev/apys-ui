<template>
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
      <div class="amount">{{ $formatIntegerPercent(apy) }}</div>
    </div>

    <div class="vault__arrow"></div>
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
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.vault {
  margin: 8px auto;
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
</style>
