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
          amount of {{ activeCurrency.symbol }},

          <div class="rewards">
            including <b>~{{ receiveRewards}}</b> {{ activeCurrency.symbol }} as rewards
          </div>

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

    uuid: {
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
    receiveDeposit: '0',
    receiveRewards: '0',
    vaultBalance: {
      deposit: 0,
      rewards: 0,
      isProcessing: false,
    },
  }),

  computed: {
    ...mapGetters(['getVaultsBalances']),
  },

  mounted() {
    // Load vault balance
    this.vaultBalance = this.getVaultsBalances[this.uuid];

    // Set default active currency
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
        const tokenPrice = this.activeCurrency.price;

        const receiveDeposit = Big(this.vaultBalance.deposit).mul(tokenPrice);
        const receiveRewards = Big(this.vaultBalance.rewards).mul(tokenPrice);
        this.receiveRewards = receiveRewards.toFixed(4);
        this.receiveDeposit = receiveDeposit.toFixed(4);
        this.receiveAmount = receiveDeposit.plus(receiveRewards).toFixed(2);
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
  .rewards {
    text-align: end;
  }

  span {
    padding: 0px 16px;
  }

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
