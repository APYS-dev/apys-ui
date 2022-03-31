<template>
  <g-modal
    :click-to-close="true"
    :is-show-close-button="true"
    :min-width="500"
    :name="nameModal"
    @close-modal="closeModal"
  >
    <template #header>
      <h3>Withdraw</h3>
    </template>

    <template #content>
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
        <span>
          You will receive
          <b>~{{ receiveAmount }}</b>
          amount of {{ activeCurrency.symbol }}
        </span>
      </div>
      <button :disabled="!canWithdraw()" class="btn-bg" @click="withdraw()">Withdraw</button>
    </template>
  </g-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import Big from 'big.js';
import { stopStrategy } from '@/near/utils';

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
    activeCurrency: '',
    receiveAmount: '0',
  }),

  computed: {
    ...mapGetters(['getVaultsBalances']),
  },

  mounted() {
    this.setActiveCurrency(this.depositTokens[0]);
  },

  methods: {
    closeModal() {
      this.$vfm.hide(this.nameModal);
    },

    setActiveCurrency(currency) {
      this.activeCurrency = currency;

      if (this.$root.isLogged) {
        // Recalculate receive amount
        const balances = this.getVaultsBalances[this.contractId];
        const tokenPrice = this.activeCurrency.price;
        this.receiveAmount = Big(balances.deposit).plus(balances.rewards).div(tokenPrice).toFixed(2);
      }
    },

    async withdraw() {
      console.log('withdraw from strategy', JSON.stringify(this.receiveAmount));

      // Stop strategy
      await stopStrategy(this.contractId, this.activeCurrency);
    },

    canWithdraw() {
      return Number(this.receiveAmount) > 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.modalBalanceInput {
  display: flex;
  gap: 8px;

  .text {
    font-size: 14px;
    font-weight: 300;
  }

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
