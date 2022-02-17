<template>
  <div class="balances p-h-20 p-v-16">
    <h3 class="m-b-16">Wallet Balance</h3>

    <div class="balances__items">
      <template v-for="balance in balances" :key="balance.name">
        <div class="balances__item">
          <img :src="balance.logoUrl" :alt="balance.name" />

          <div class="balances__item-amount">
            <p class="amount">{{ $formatPrice(balance.amount, true) }}</p>
            <p class="name">{{ balance.name }}</p>
          </div>

          <div class="balances__item-buttons">
            <button class="btn" @click="$vfm.show('withdraw')">Withdraw</button>
            <button class="btn btn-bg">Deposit</button>
          </div>
        </div>
      </template>
    </div>
  </div>
  <g-modal
    v-model="isShowModal"
    name="withdraw"
    :click-to-close="true"
    :is-show-close-button="true"
    :width="580"
    @close-modal="closeModal"
  >
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
  background-color: #fff;
  border-radius: 3px;

  &__item {
    margin-top: 12px;
    margin-bottom: 12px;
    padding-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid #ddd;
    font-size: 12px;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    img {
      width: 100%;
      max-width: 26px;
    }

    &-amount {
      text-align: center;

      .amount {
        font-weight: bold;
      }

      .name {
        color: rgb(161, 161, 161);
      }
    }

    &-buttons {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      gap: 8px;

      .btn {
        font-size: 10px;
        color: rgb(49, 170, 183);
      }

      .btn-bg {
        padding: 8px 12px;
        background-color: rgba(49, 170, 183, 0.12);
      }
    }
  }
}
</style>
