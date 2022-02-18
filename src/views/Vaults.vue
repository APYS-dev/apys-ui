<template>
  <div class="vaults">
    <header class="p-h-20 p-v-16">
      <h3>Vaults</h3>

      <div class="vaults__tabs">
        <button class="active">Live</button>
        <button>Upcoming</button>
        <button>In progress</button>
      </div>
    </header>

    <main>
      <vault
        v-for="vault in vaults"
        :key="vault.name"
        :name="vault.name"
        :tvl="vault.tvl"
        :apy="vault.apy"
        :logoes-url="vault.logoesUrl"
      ></vault>
    </main>
  </div>

  <g-modal name="calculate" :click-to-close="true" :is-show-close-button="true" :width="580" @close-modal="closeModal">
    <template #header>
      <h3 class="m-b-36">Calculating rewards</h3>
    </template>

    <template #content>
      <div class="modal__inp-group">
        Stake
        <g-autonumeric v-model="amountToStake" />
        <span style="margin-left: -50px">USDT</span>
      </div>
    </template>
  </g-modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Vault from '@/views/Vault.vue';
import GAutonumeric from '@/components/G-autonumeric.vue';

export default {
  name: 'Vaults',

  components: { Vault, GAutonumeric },

  data: () => ({
    vaults: {},
    amountToStake: 0,
  }),

  computed: {
    ...mapGetters(['getVaults']),
  },

  mounted() {
    this.loadVaults();
    this.vaults = this.getVaults;
  },

  methods: {
    ...mapActions(['loadVaults']),

    closeModal() {
      this.$vfm.hide('calculate');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.vaults {
  header {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-radius: 3px;
  }

  &__tabs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 22px;

    button {
      border-radius: 22px;
      padding: 8px 16px 7px;

      &.active {
        background-color: rgb(49, 170, 183);
        color: #fff;
      }
    }
  }
}
</style>
