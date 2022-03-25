<template>
  <div class="vaults">
    <header>
      <h2>Vaults</h2>

      <div class="vaults__tabs">
        <button class="active">Live</button>
        <button>Upcoming</button>
        <button>Finished</button>
      </div>
    </header>

    <main>
      <vault
        v-for="vault in vaults"
        :key="vault.name"
        :name="vault.name"
        :tvl="vault.tvl"
        :apr="vault.apr"
        :dex="vault.dex"
        :contract-id="vault.contractId"
        :deposit-tokens="vault.depositTokens"
        :user-actions="userActions[vault.contractId]"
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
    userActions: {},
  }),

  computed: {
    ...mapGetters(['getVaults', 'getUserActions']),
  },

  async mounted() {
    this.vaults = this.getVaults;
    this.userActions = this.getUserActions;
  },

  methods: {},
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
