<template>
  <div :class="{ active: show }" class="vault-more-wrap">
    <div class="vault-more">
      <div>
        <h3 class="vault-more__header">Deposited</h3>

        <div class="vault-more__body">
          <div class="amount">{{ $root.isLogged ? $formatPrice(getDeposit()) : '–' }}</div>
        </div>
      </div>

      <div>
        <h3 class="vault-more__header">Rewards</h3>

        <div class="vault-more__body">
          <div class="amount">{{ $root.isLogged ? $formatPrice(getRewards()) : '–' }}</div>
          <!--          <div class="amount__plus">(+$0.0001)</div>-->
          <div v-if="showCounter" class="amount__plus">
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
    };
  },

  computed: {
    ...mapGetters(['getVaultsBalances', 'getBalances']),
  },

  async mounted() {
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

      const secondsFromLastReward = moment.utc().diff(moment.utc(last_reward_time), 'seconds');
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
      return new Big(this.getVaultsBalances[this.contractId].deposit).toString();
    },

    getRewards() {
      // Get and return vault rewards amount
      return this.getVaultsBalances[this.contractId].rewards;
    },

    getDepositPlusProfit() {
      return new Big(this.getDeposit()).add(this.getRewards());
    },

    isProcessing() {
      return this.getVaultsBalances[this.contractId].isProcessing;
    },

    isLiveStatus() {
      return this.status === 'live';
    },

    canWithdraw() {
      return Number(this.getDeposit()) + Number(this.getRewards()) > 0;
    },

    canDeposit() {
      const hasDepositBalance = this.getBalances.map((it) => Number(it.appBalance)).reduce((a, b) => a + b, 0) > 0;
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
