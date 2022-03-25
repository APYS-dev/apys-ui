<template>
  <g-modal
    :name="nameModal"
    :click-to-close="true"
    :is-show-close-button="true"
    :min-width="467"
    @close-modal="closeModal"
    @before-close="clearDropdown"
  >
    <template #header>
      <h3>Deposit</h3>
    </template>

    <template #content>
      <div class="modalBalanceAmount">You have {{ $formatPrice(balancesByToken[activeCurrency.symbol], true) }}</div>
      <div class="modalBalanceInput">
        <g-dropdown :ref="$id('token')" position="bottom">
          <div :key="$id(activeCurrency.symbol)" class="btn btn-bg-light dropdown-icon">
            <img :src="`/static/images/tokens/${activeCurrency.symbol}.svg`" :alt="activeCurrency.symbol" />
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
                  <img :src="`/static/images/tokens/${token.symbol}.svg`" :alt="token.symbol" />
                  <span>{{ token.symbol }}</span>
                </li>
              </template>
            </ul>
          </template>
        </g-dropdown>

        <g-autonumeric v-model="modalVaultAmount" />
        <span @click="maxAmount">Max</span>
      </div>
      <button class="btn-bg" @click="deposit">Deposit</button>
    </template>
  </g-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { startStrategy } from '@/near/utils';

export default {
  name: 'ModalDepositFromVault',

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

    clearDropdown() {
      this.$refs[this.$id('token')].closeDropdown();
    },
    setActiveCurrency(currency) {
      if (currency) {
        this.activeCurrency = currency;
      }
    },
    async deposit() {
      console.log('deposit to strategy');
      let amount = 0;

      // Check that amount in the input same as the max amount
      const isPriceSame =
        this.$formatPrice(this.modalVaultAmount, true) ===
        this.$formatPrice(this.balancesByToken[this.activeCurrency.symbol], true);
      if (isPriceSame) {
        amount = this.balancesByToken[this.activeCurrency.symbol];
      } else {
        amount = this.modalVaultAmount;
      }

      // Start strategy
      await startStrategy(this.contractId, this.activeCurrency, amount);
    },

    maxAmount() {
      const amount = this.balancesByToken[this.activeCurrency.symbol];
      this.modalVaultAmount = this.$formatPrice(amount, true);
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
