<template>
  <div class="vault-more-wrap" :class="{ active: show }">
    <div class="vault-more">
      <div>
        <h3 class="vault-more__header">Deposited</h3>

        <div class="vault-more__body">
          <div>
            <div class="amount">{{ $root.isLogged ? $formatPrice(0, true) : '–' }}</div>
            <div class="price">{{ $root.isLogged ? $formatPrice(0) : '–' }}</div>
          </div>
          <div class="currency">USDT</div>
        </div>
      </div>

      <div>
        <h3 class="vault-more__header">Rewards</h3>

        <div class="vault-more__body">
          <div>
            <div class="amount">{{ $root.isLogged ? $formatPrice(0, true) : '–' }}</div>
            <div class="price">{{ $root.isLogged ? $formatPrice(0) : '–' }}</div>
          </div>
          <div class="currency">USDT</div>
        </div>
      </div>

      <div class="vault-more__btns">
        <template v-if="$root.isLogged">
          <button class="btn-bg" @click="showDepositFromVault">Desposit</button>
          <button class="btn-border" @click="showWithdrawFromVault">Withdraw</button>
        </template>
        <button v-else class="btn-medium btn-bg">Connect wallet</button>
      </div>
    </div>
  </div>

  <modal-deposit-from-vault
      :deposit-tokens="depositTokens"
      :name-modal="$id('DepositFromVault')"
      :contract-id="contractId"
  ></modal-deposit-from-vault>

  <modal-withdraw-from-vault
      :deposit-tokens="depositTokens"
      :name-modal="$id('WithdrawFromVault')"
      :contract-id="contractId"
  ></modal-withdraw-from-vault>
</template>

<script>
import ModalDepositFromVault from './ModalDepositFromVault.vue';
import ModalWithdrawFromVault from './ModalWithdrawFromVault.vue';

export default {
  name: 'VaultMore',

  components: {ModalDepositFromVault, ModalWithdrawFromVault},

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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
