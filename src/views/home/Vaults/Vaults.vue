<template>
  <div class="vaults">
    <header>
      <h2>Vaults</h2>

      <div class="vaults__tabs">
        <button :class="selectedTab === 'live' ? 'active' : ''" @click="changeTab('live')">Live</button>
        <button :class="selectedTab === 'upcoming' ? 'active' : ''" @click="changeTab('upcoming')">Upcoming</button>
        <button :class="selectedTab === 'finished' ? 'active' : ''" @click="changeTab('finished')">Finished</button>
      </div>
    </header>

    <main>
      <vault
        v-for="vault in vaults[selectedTab]"
        :key="vault.name"
        :apr="vault.apr"
        :contract-id="vault.contractId"
        :deposit-tokens="vault.depositTokens"
        :dex="vault.dex"
        :dex-url="vault.dexUrl"
        :name="vault.name"
        :tvl="vault.tvl"
      ></vault>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Vault from './Vault.vue';

export default {
  name: 'Vaults',

  components: { Vault },

  data: () => ({
    vaults: {},
    selectedTab: 'live',
  }),

  computed: {
    ...mapGetters(['getVaults']),
  },

  async mounted() {
    // Sort vaults by status
    this.vaults = {
      'live': this.getVaults.filter((it) => it.status === 'live'),
      'upcoming': this.getVaults.filter((it) => it.status === 'upcoming'),
      'finished': this.getVaults.filter((it) => it.status === 'finished'),
    };
  },

  methods: {
    changeTab(selectedTab) {
      console.log(selectedTab);
      if (selectedTab !== this.selectedTab) {
        this.selectedTab = selectedTab;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.vaults {
  header {
    margin-bottom: 12px;
    padding: 16px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 55px;
    background-color: var(--background-color);
    box-shadow: 0px -4px 50px rgba(47, 91, 96, 0.08);
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
