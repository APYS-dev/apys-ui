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
        <g-dropdown :ref="$id('token')" position="bottom">
          <div :key="$id(activeCurrency)" class="btn btn-bg-light dropdown-icon">
            <img :src="`/static/images/tokens/${activeCurrency}.svg`" :alt="activeCurrency" /> {{ activeCurrency }}
          </div>

          <template #content>
            <ul class="list-dropbox">
              <template v-for="token in depositTokens">
                <li
                  v-if="token !== activeCurrency"
                  :key="$id(token)"
                  @click="setActiveCurrency(token), $refs[$id('token')].closeDropdown()"
                >
                  <img :src="`/static/images/tokens/${token}.svg`" :alt="token" />
                  <span>{{ token }}</span>
                </li>
              </template>
            </ul>
          </template>
        </g-dropdown>

        <g-autonumeric v-model="modalVaultAmount" />
        <button @click="maxAmount">Max</button>
      </div>
      <button class="btn-bg">Withdraw</button>
    </template>
  </g-modal>
</template>

<script>
import {mapGetters} from "vuex";

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
  }),

  computed: {
    ...mapGetters(['getBalances']),
  },

  mounted() {
    this.activeCurrency = this.depositTokens[0];
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
      const amount = this.balancesByToken[this.activeCurrency];
      this.modalVaultAmount = this.$formatPrice(amount, true);
    }
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
