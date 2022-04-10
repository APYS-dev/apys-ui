<template>
  <div :class="{ active: show }" class="vault-more-wrap">
    <div class="vault-more">
      <div>
        <h3 class="vault-more__header">Deposited</h3>

        <div class="vault-more__body">
          <div class="amount">{{ isShowBalance() ? $formatPrice(getDeposit()) : '–' }}</div>
        </div>
      </div>

      <div>
        <h3 class="vault-more__header">
          Bonus
          <span class="light-text">(coming soon)</span>
        </h3>

        <div class="vault-more__bonus-body">
          <div>
            <template v-for="token in rewardTokens" :key="token">
              <div class="token-balance">
                <img :alt="token" :src="`/static/images/tokens/${token}.svg`" />
                <div class="token-amount">{{ '–' }}</div>
              </div>
            </template>
          </div>
          <button v-if="$root.isLogged" :disabled="true" class="btn-small btn-border">Claim</button>
        </div>
      </div>

      <div>
        <h3 class="vault-more__header">Rewards</h3>

        <div class="vault-more__body">
          <div class="amount">{{ isShowBalance() ? $formatPrice(getRewards()) : '–' }}</div>
          <!--          <div class="amount__plus">(+$0.0001)</div>-->
          <div v-if="isShowCounter()" class="amount__plus">
            <vue3-autocounter
              ref="counter"
              :autoinit="false"
              :decimals="counterDecimals"
              :duration="counterDuration"
              :end-amount="endAmount"
              :start-amount="startAmount"
              decimal-separator="."
              prefix="+"
              separator=","
              @finished="startCounter"
            />
          </div>
        </div>
      </div>

      <div v-if="$root.isLogged" class="vault-more__btns">
        <template v-if="isProcessing()">
          <button class="btn-border-progress">Processing...</button>
        </template>
        <template v-if="$root.isLogged && !isProcessing()">
          <button :disabled="!isLiveStatus()" class="btn-bg" @click="showDepositFromVault">Desposit</button>
          <button :disabled="!canWithdraw()" class="btn-border" @click="showWithdrawFromVault">Withdraw</button>
        </template>
      </div>
      <button v-if="!$root.isLogged" class="btn-bg" @click="login">Connect wallet</button>
    </div>
  </div>

  <modal-deposit-from-vault
    :contract-id="contractId"
    :deposit-tokens="depositTokens"
    :name-modal="$id('DepositFromVault')"
  ></modal-deposit-from-vault>

  <modal-withdraw-from-vault
    :contract-id="contractId"
    :deposit-tokens="depositTokens"
    :name-modal="$id('WithdrawFromVault')"
    :uuid="uuid"
  ></modal-withdraw-from-vault>
</template>

<script>
import ModalDepositFromVault from './ModalDepositFromVault.vue';
import ModalWithdrawFromVault from './ModalWithdrawFromVault.vue';
import { login, view } from '@/near/utils';
import { mapGetters } from 'vuex';
import Big from 'big.js';
import Vue3autocounter from 'vue3-autocounter';
import moment from 'moment';

const SECONDS_IN_YEAR = 31536000;

export default {
  name: 'VaultMore',

  components: { ModalDepositFromVault, ModalWithdrawFromVault, 'vue3-autocounter': Vue3autocounter },

  props: {
    show: {
      type: Boolean,
      default: false,
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

    status: {
      type: String,
      required: true,
    },

    apr: {
      type: [Number, String],
      required: true,
      default: '0',
    },

    rewardTokens: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      strategyAmount: '0',
      isInProcess: true,
      showCounter: false,
      login: () => login(),
      counterDecimals: 6,
      startAmount: 0,
      endAmount: 0,
      counterDuration: 5,
      oneSecondProfit: 0,
      vaultBalance: {
        deposit: 0,
        rewards: 0,
        isProcessing: false,
      },
      balances: {},
    };
  },

  computed: {
    ...mapGetters(['getVaultsBalances', 'getBalances']),
  },

  async mounted() {
    // Load app balances
    this.balances = this.getBalances;

    // Load vault balance
    this.vaultBalance = this.getVaultsBalances[this.uuid];

    // Start counter
    await this.startCounter();
  },

  methods: {
    async startCounter() {
      this.showCounter = false;
      const { last_reward_time } = await view({ contractId: this.contractId, methodName: 'get_metadata' });
      if (last_reward_time === '0') {
        return;
      }
      const depositPlusProfit = this.getDepositPlusProfit();
      if (depositPlusProfit.eq(0)) {
        return;
      }

      const secondsFromLastReward = moment.utc().diff(moment.utc(Number(last_reward_time.substr(0, 13))), 'seconds');
      const oneYearProfit = depositPlusProfit.mul(this.apr).div(100);
      const oneSecondProfit = oneYearProfit.div(SECONDS_IN_YEAR);
      const profitFromLastReward = oneSecondProfit.mul(secondsFromLastReward);

      this.oneSecondProfit = oneSecondProfit.toNumber();
      this.counterDuration = 7200; // two hours
      this.startAmount = profitFromLastReward.toNumber();
      this.endAmount = profitFromLastReward.add(oneSecondProfit.mul(this.counterDuration)).toNumber();
      this.showCounter = true;
      setTimeout(() => {
        this.$refs.counter.start();
      }, 0);
    },
    isShowCounter() {
      return !this.isProcessing() && this.showCounter;
    },
    showDepositFromVault() {
      this.$vfm.show(this.$id('DepositFromVault'));
    },

    closeDepositFromVault() {
      this.$vfm.hide(this.$id('DepositFromVault'));
    },

    showWithdrawFromVault() {
      this.$vfm.show(this.$id('WithdrawFromVault'));
    },

    closeWithdrawFromVault() {
      this.$vfm.hide(this.$id('WithdrawFromVault'));
    },

    getDeposit() {
      return new Big(this.vaultBalance.deposit).toString();
    },

    getRewards() {
      // Get and return vault rewards amount
      return this.vaultBalance.rewards;
    },

    getDepositPlusProfit() {
      return new Big(this.getDeposit()).add(this.getRewards());
    },

    isProcessing() {
      return this.vaultBalance.isProcessing;
    },

    isLiveStatus() {
      return this.status === 'live';
    },

    isShowBalance() {
      return this.$root.isLogged && this.status !== 'upcoming';
    },

    canWithdraw() {
      return Number(this.getDeposit()) + Number(this.getRewards()) > 0;
    },

    canDeposit() {
      const hasDepositBalance = this.balances.map((it) => Number(it.appBalance)).reduce((a, b) => a + b, 0) > 0;
      return hasDepositBalance && this.isLiveStatus();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;

  & > div {
    flex: 0;

    &:not(.vault-more__btns) {
      flex: 1;
    }

    &:first-child {
      margin-right: 24px;
      border-right: 1px solid rgba(13, 13, 13, 0.1);
    }

    &:nth-child(2) {
      margin-right: 24px;
      border-right: 1px solid rgba(13, 13, 13, 0.1);
    }
  }

  &__header {
    font-size: 11px;
    color: rgba(13, 13, 13, 0.4);

    .light-text {
      font-size: 11px;
      color: rgba(0, 0, 0, 0.3);
    }
  }

  &__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 46px;
  }

  &__bonus-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 24px;
    min-height: 46px;

    .token-balance {
      display: flex;
      flex-direction: row;
      gap: 8px;

      img {
        width: 19.2px;
      }

      .token-amount {
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.3);
      }
    }
  }

  .amount {
    margin: 8px 0;
    font-size: 24px;
    font-weight: 500;
    color: var(--color-main);

    &__plus {
      flex-grow: 1;
      margin: 0 8px 0 8px;
      color: var(--color-main-90);
      font-family: monospace;
      font-size: 0.8rem;
      align-self: end;
    }
  }

  .price {
    font-size: 12px;
    color: rgba(13, 13, 13, 0.3);
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

    button {
      min-width: max-content;
    }
  }
}
</style>
