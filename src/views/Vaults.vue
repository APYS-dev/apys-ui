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
      <div class="vaults">
        <div v-for="vault in vaults" :key="vault.name" class="vault">
          <vault :name="vault.name" :tvl="vault.tvl" :apy="vault.apy" :logoes-url="vault.logoesUrl"></vault>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Vault from '@/views/Vault.vue';

export default {
  name: 'Vaults',

  components: { Vault },

  data: () => ({
    vaults: {},
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.vaults {
  header {
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
