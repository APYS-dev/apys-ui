<template>
  <div class="balances">
    <h3>walletname.near</h3>

    <div class="balances__items">
      <template v-for="balance in balances" :key="balance.name">
        <div class="balances__item">
          <img :src="balance.logoUrl" :alt="balance.name" />

          <div class="balances__item-amount">
            <p class="amount">{{ $formatPrice(balance.amount, true) }}</p>
            <p class="name">{{ balance.name }}</p>
          </div>

          <div class="balances__item-buttons">
            <button class="btn-small" @click="$vfm.show('withdraw')">Withdraw</button>
            <button class="btn-small btn-bg-light">Deposit</button>
          </div>
        </div>
      </template>
    </div>
  </div>
  <g-modal name="withdraw" :click-to-close="true" :is-show-close-button="true" :width="580" @close-modal="closeModal">
    <template #header>
      <h3 class="m-b-36">Header</h3>
    </template>

    <template #content>content</template>
  </g-modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import gModal from '@/components/G-modal.vue';

export default {
  name: 'Balances',

  components: { gModal },

  data: () => ({
    balances: {},
  }),

  computed: {
    ...mapGetters(['getBalances']),
  },

  mounted() {
    this.loadBalances();
    this.balances = this.getBalances;
  },

  methods: {
    ...mapActions(['loadBalances']),

    showModal() {
      this.$vfm.show('withdraw');
    },

    closeModal() {
      this.$vfm.hide('withdraw');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.balances {
  padding: 16px 24px;
  background-color: var(--background-color);
  border-radius: 4px;

  h3 {
    margin-bottom: 20px;
  }

  &__item {
    margin-bottom: 12px;
    padding-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    img {
      height: 100%;
      max-height: 26px;
    }

    &-amount {
      text-align: center;

      .amount {
        font-weight: bold;
      }

      .name {
        color: rgba(13, 13, 13, 0.4);
      }
    }

    &-buttons {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      gap: 4px;
    }
  }
}
</style>
