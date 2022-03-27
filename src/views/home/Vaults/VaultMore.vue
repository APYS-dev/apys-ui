<template>
  <div :class="{ active: show }" class="vault-more-wrap">
    <div class="vault-more">
      <div>
        <h3 class="vault-more__header">Deposited</h3>

        <div class="vault-more__body">
          <div class="amount">{{ $root.isLogged ? getDeposit() : '–' }}</div>
        </div>
      </div>

      <div>
        <h3 class="vault-more__header">Rewards</h3>

        <div class="vault-more__body">
          <div class="amount">{{ $root.isLogged ? getRewards() : '–' }}</div>
        </div>
      </div>

      <div class="vault-more__btns">
        <template v-if="isInProcess">
          <div>processing...</div>
        </template>
        <template v-if="$root.isLogged && !isInProcess">
          <button class="btn-bg" @click="showDepositFromVault">Desposit</button>
          <button class="btn-border" @click="showWithdrawFromVault">Withdraw</button>
        </template>
        <button v-else-if="!$root.isLogged" class="btn-medium btn-bg" @click="login">Connect wallet</button>
      </div>
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
import { login } from '@/near/utils';
import { mapGetters } from 'vuex';

export default {
  name: 'VaultMore',

  components: { ModalDepositFromVault, ModalWithdrawFromVault },

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
    depositAction: {
      type: Object,
      required: false,
      default: () => {},
    },
    strategyBalance: {
      type: Object,
      required: false,
      default: () => {},
    },
  },

  data() {
    return {
      strategyAmount: '0',
      isInProcess: true,
      login: () => login(),
    };
  },

  computed: {
    ...mapGetters(['getShares', 'getVaultsBalances']),
  },

  mounted() {
    const deposited = this.depositAction?.amount || this.strategyBalance?.amount;
    if (deposited) {
      this.strategyAmount = deposited;
      this.isInProcess = true;
    } else {
      this.isInProcess = false;
    }
  },

  methods: {
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
      // Get vault deposit amount
      const amount = this.getVaultsBalances[this.contractId].deposit;
      console.log('getVaultsBalances', this.getVaultsBalances[this.contractId]);

      // Format and return deposit amount
      return this.$formatPrice(amount);
    },

    getRewards() {
      // Get vault rewards amount
      const amount = this.getVaultsBalances[this.contractId].rewards;

      // Format and return rewards amount
      return this.$formatPrice(amount);
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
