<template>
  <g-modal
    :name="nameModal"
    :click-to-close="true"
    :is-show-close-button="true"
    :min-width="467"
    @close-modal="closeModal"
  >
    <template #header>
      <h3>Withdraw</h3>
    </template>

    <template #content>
      <div class="modalBalanceAmount">You have {{ $formatPrice(1000, true) }}</div>
      <div class="modalBalanceInput">
        <g-dropdown :ref="$id('currency')" position="bottom">
          <div :key="$id('USDT')" class="btn btn-bg-light dropdown-icon">
            <img src="/static/images/tokens/usdt.svg" :alt="currency" /> {{ activeCurrency }}
          </div>

          <template #content>
            <ul class="list-dropbox">
              <template v-for="currency in currencyList">
                <li
                  v-if="currency !== activeCurrency"
                  :key="$id(currency)"
                  @click="setActiveCurrency(currency), $refs[$id('currency')].closeDropdown()"
                >
                  <img src="/static/images/tokens/usdt.svg" :alt="currency" />
                  <span>{{ currency }}</span>
                </li>
              </template>
            </ul>
          </template>
        </g-dropdown>

        <g-autonumeric v-model="modalVaultAmount" />
        <span>Max</span>
      </div>
      <button class="btn-bg">Withdraw</button>
    </template>
  </g-modal>
</template>

<script>
export default {
  name: 'ModalWithdrawFromVault',

  props: {
    nameModal: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    modalVaultAmount: 0,
    currencyList: ['USDT', 'USDC', 'DAI'],
    activeCurrency: 'USDT',
  }),

  methods: {
    closeModal() {
      this.$vfm.hide(this.nameModal);
    },

    setActiveCurrency(currency) {
      if (currency) {
        this.activeCurrency = currency;
      }
      return;
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
