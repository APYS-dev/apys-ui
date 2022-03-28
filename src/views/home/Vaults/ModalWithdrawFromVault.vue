<template>
  <g-modal
    :click-to-close="true"
    :is-show-close-button="true"
    :min-width="467"
    :name="nameModal"
    @close-modal="closeModal"
  >
    <template #header>
      <h3>Withdraw</h3>
    </template>

    <template #content>
      <div class="modalBalanceAmount">You have {{ $formatPrice(1000, true) }}</div>
      <div class="modalBalanceInput">
        <g-dropdown :ref="$id('token')" position="bottom">
          <div :key="$id(activeCurrency.symbol)" class="btn btn-bg-light dropdown-icon">
            <img :alt="activeCurrency.symbol" :src="`/static/images/tokens/${activeCurrency.symbol}.svg`" />
            {{ activeCurrency.symbol }}
          </div>

          <template #content>
            <ul class="list-dropbox">
              <template v-for="token in depositTokens">
                <li
                  v-if="token.symbol !== activeCurrency.symbol"
                  :key="$id(token.symbol)"
                  @click="setActiveCurrency(token), $refs[$id('token')].closeDropdown()"
                >
                  <img :alt="token.symbol" :src="`/static/images/tokens/${token.symbol}.svg`" />
                  <span>{{ token.symbol }}</span>
                </li>
              </template>
            </ul>
          </template>
        </g-dropdown>

        <g-autonumeric v-model="modalVaultAmount" />
        <button @click="maxAmount">Max</button>
      </div>
      <button :disabled="!canWithdraw()" class="btn-bg">Withdraw</button>
    </template>
  </g-modal>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalWithdrawFromVault',

  props: {
    nameModal: {
      type: String,
      required: true,
    },
    depositTokens: {
      type: Array,
      required: true,
      default: () => [],
    },
    contractId: {
      type: [String],
      required: true,
    },
  },

  data: () => ({
    modalVaultAmount: 0,
    activeCurrency: '',
    balancesByToken: {},
  }),

  computed: {
    ...mapGetters(['getBalances']),
  },

  mounted() {
    this.activeCurrency = this.depositTokens[0];
    this.balancesByToken = this.getBalances.reduce((acc, next) => {
      acc[next.token.symbol] = next.appBalance;
      return acc;
    }, {});
  },

  methods: {
    closeModal() {
      this.$vfm.hide(this.nameModal);
    },

    setActiveCurrency(currency) {
      if (currency) {
        this.activeCurrency = currency;
      }
    },

    maxAmount() {
      const amount = this.balancesByToken[this.activeCurrency.symbol];
      this.modalVaultAmount = this.$formatPrice(amount, true);
    },

    canWithdraw() {
      return Number(this.balancesByToken[this.activeCurrency.symbol]) > 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.modalBalanceInput {
  display: flex;
  gap: 8px;

  .btn-bg-light {
    padding: 4px 12px;
  }

  & + .btn-bg {
    width: 100%;
  }
}

.btn-bg-light,
.dropdown-box .list-dropbox li {
  padding: 8px 12px;
  display: flex;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;

  img {
    width: 26px;
  }
}
</style>
