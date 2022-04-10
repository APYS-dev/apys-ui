<template>
  <g-modal
    :click-to-close="true"
    :is-show-close-button="true"
    :min-width="467"
    :name="nameModal"
    @close-modal="closeModal"
    @before-close="clearDropdown"
  >
    <template #header>
      <h3>Deposit</h3>
    </template>

    <template #content>
      <div class="modalBalanceAmount">
        You have {{ $formatPrice(balance, true) }}
        {{ activeCurrency.symbol }}
      </div>
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

        <g-autonumeric v-model="modalVaultAmount" :placeholder="`Min amount is ${getMinAmount()}`" />
        <span @click="maxAmount">Max</span>
      </div>
      <button :disabled="!canDeposit" class="btn-bg" @click="deposit">Deposit</button>
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
    modalVaultAmount: null,
    activeCurrency: '',
    canDeposit: false,
    balance: 0,
    balancesByToken: {},
    useMaxAmount: true,
  }),

  computed: {
    ...mapGetters(['getBalances']),
  },

  watch: {
    modalVaultAmount(val) {
      // Check amount is enough for deposit or not
      const hasDepositBalance = Number(this.balance) > 0;
      const hasEnoughAmount = Number(val) >= Number(this.activeCurrency.minDepositAmount);
      this.canDeposit = hasDepositBalance && hasEnoughAmount;

      // Check that inputted amount the same as max
      this.useMaxAmount = Number(this.balance).toFixed(2) === Number(val).toFixed(2);
    },
  },

  mounted() {
    // Create balances by tokens
    this.balancesByToken = this.getBalances.reduce((acc, next) => {
      acc[next.token.symbol] = next.appBalance;
      return acc;
    }, {});

    // Set active currency
    this.setActiveCurrency(this.depositTokens[0]);
  },

  methods: {
    closeModal() {
      this.$vfm.hide(this.nameModal);
    },

    clearDropdown() {
      this.$refs[this.$id('token')].closeDropdown();
    },
    setActiveCurrency(currency) {
      this.modalVaultAmount = null;
      this.activeCurrency = currency;
      this.useMaxAmount = false;

      // Change current balance
      this.balance = this.balancesByToken[currency.symbol];
    },
    async deposit() {
      const amount = this.useMaxAmount ? this.balance : this.modalBalanceAmount;

      // Start strategy
      await startStrategy(this.contractId, this.activeCurrency, amount);
    },

    maxAmount() {
      // Skip if amount is zero
      if (Number(this.balance) === 0) {
        return;
      }

      // Set amount to max
      this.modalVaultAmount = this.$formatPrice(this.balance, true);
    },

    getMinAmount() {
      return Number(this.activeCurrency.minDepositAmount);
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
