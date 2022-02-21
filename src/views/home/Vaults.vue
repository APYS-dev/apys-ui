<template>
  <div class="vaults">
    <header>
      <h2>Vaults</h2>

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
        <span style="margin-left: -50px; color: #000">USDT</span>
      </div>
    </template>
  </g-modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Vault from './Vault.vue';
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
    margin-bottom: 12px;
    padding: 16px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 55px;
    background-color: var(--background-color);
    border-radius: 4px;
  }

  &__tabs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    border: 1px solid rgba(211, 211, 211, 0.46);
    border-radius: 24px;

    button {
      padding-right: 16px;
      padding-left: 16px;
      height: 24px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.3);
      border-radius: 24px;

      &.active {
        margin-top: -1px;
        height: 25px;
        background-color: rgb(49, 170, 183);
        color: #fff;
      }
    }
  }
}
</style>
