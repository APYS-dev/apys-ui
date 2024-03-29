<template>
  <div class="vaults">
    <header>
      <h2>Vaults</h2>

      <div class="vaults__tabs">
        <button
          v-for="tab in tabs"
          :key="tab.status"
          :class="{ active: tab === currentTab }"
          @click="selectTab(tab)"
        >
          {{ tab.title }}
        </button>
      </div>
    </header>
    <main>
      <VaultCard
        v-for="vault in filteredVaults()"
        :key="vault.meta.uuid"
        :vault="vault"
      />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import type { Vault } from "@/stores/types";
import { useVaultStore } from "@/stores/vault";
import VaultCard from "@/components/vault/VaultCard.vue";
import type { VaultMeta } from "@/network/models/InfoServerModels";

interface VaultTab {
  title: string;
  status: VaultMeta["status"];
}

const VAULTS_TABS: VaultTab[] = [
  { title: "Live", status: "live" },
  { title: "Upcoming", status: "upcoming" },
  { title: "Finished", status: "finished" },
];

export default defineComponent({
  components: { VaultCard },

  data() {
    return {
      tabs: VAULTS_TABS,
      currentTab: VAULTS_TABS[0],
      vaults: [] as Vault[],
    };
  },

  async mounted() {
    // Listen for vault store changes
    const vaultStore = useVaultStore();
    watch(vaultStore.$state, async (state) => {
      if (this.vaults !== state.vaults) {
        this.vaults = state.vaults;
      }
    });
  },

  methods: {
    selectTab(tab: VaultTab) {
      this.currentTab = tab;
    },

    filteredVaults() {
      return this.vaults.filter((vault) => {
        return vault.meta.status === this.currentTab.status;
      });
    },
  },
});
</script>

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
