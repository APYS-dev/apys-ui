<template>
  <div class="vaults">
    <header>
      <h2>Vaults</h2>

      <!--      <div class="vaults__tabs">-->
      <!--        <button v-for="tab in tabs" :key="tab.status" :class="{ 'active': tab.isActive }" @click="selectTab(tab)">-->
      <!--          {{ tab.title }}-->
      <!--        </button>-->
      <!--      </div>-->
    </header>

    <main>
      <!--      <div v-for="tab in []" v-show="tab.isActive" :key="tab.status">-->
      <vault
        v-for="vault in getVaults"
        :key="vault.name"
        :apr="vault.apr"
        :contract-id="vault.contractId"
        :deposit-tokens="vault.depositTokens"
        :dex="vault.dex"
        :dex-url="vault.dexUrl"
        :name="vault.name"
        :reward-tokens="vault.rewardTokens"
        :status="vault.status"
        :tvl="vault.tvl"
        :uuid="vault.uuid"
      />
      <!--      </div>-->
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
    tabs: [
      { title: 'Live', 'status': 'live', isActive: true },
      { title: 'Upcoming', 'status': 'upcoming', isActive: false },
      { title: 'Finished', 'status': 'finished', isActive: false },
    ],
  }),

  computed: {
    ...mapGetters(['getVaults']),
  },

  async mounted() {},

  methods: {
    selectTab(selected) {
      // loop over all the tabs
      this.tabs.forEach((tab) => {
        tab.isActive = tab.status === selected.status;
      });
    },

    getVaultsByStatus(status) {
      return this.getVaults.filter((it) => it.status === status);
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
