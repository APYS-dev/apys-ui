<template>
  <div class="auto-farming">
    <h2>Auto-farming</h2>

    <template v-for="category in categories" :key="category">
      <h3 class="auto-farming__label">{{ getCategoryLabel(category) }}</h3>
      <div class="auto-farming__strategies">
        <div
          class="auto-farming__strategy"
          v-for="vault in vaultsByCategory(category)"
          :class="{ active: checkVaultActive(vault) }"
          :key="vault.meta.uuid"
          @click="toggleVault(vault)"
        >
          <div class="auto-farming__strategy__title">
            <div class="auto-farming__strategy__title__logo">
              <img
                v-for="token in vault.meta.depositTokens"
                :key="token.symbol"
                :alt="token.symbol"
                :src="`/static/icons/token/${token.symbol}.svg`"
              />
            </div>

            <div class="auto-farming__strategy__title__label">
              {{ vault.meta.name }}
            </div>
          </div>
          <div class="auto-farming__strategy__content">
            <div class="auto-farming__strategy__content__info">
              <div class="auto-farming__strategy__content__info__label">
                APY
              </div>
              <div class="auto-farming__strategy__content__info__text">
                {{ formatAPY(vault.meta) }}
              </div>
            </div>
            <div class="auto-farming__strategy__content__info">
              <div class="auto-farming__strategy__content__info__label">
                DEX
              </div>
              <a :href="vault.meta.dexUrl" target="_blank">
                <img
                  :src="`/static/icons/dex/${vault.meta.dex}.svg`"
                  :alt="vault.meta.dex"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="auto-farming__buttons">
      <button
        v-if="isSignedIn"
        :disabled="!isAutoFarmingAvailable()"
        class="btn-bg"
        @click="handleAutoFarming"
      >
        {{ configChanges.active ? `Apply changes` : `Start auto farming` }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Ref } from "vue";
import type { VaultMeta } from "@/network/models/InfoServerModels";
import { useVaultStore } from "@/stores/vault";
import type { Vault } from "@/stores/types";
import { useAuthStore } from "@/stores/auth";
import { aprToApy } from "@/utils/math";
import Big from "big.js";
import { useAutoFarmingStore } from "@/stores/autoFarming";
import { useLogger } from "vue-logger-plugin";
import type {
  AutoFarmingChanges,
  AutoFarmingConfig,
} from "@/network/models/ApysModels";

interface ConfigChanges {
  active: boolean;
  enabled: boolean;
  changes: Record<VaultMeta["category"], AutoFarmingChanges>;
}

const logger = useLogger();

// Stores
const { isSignedIn } = useAuthStore();
const { fetchAutoFarmingConfig, updateAutoFarming } = useAutoFarmingStore();

// Define data
const vaults: Ref<Vault[]> = ref([]);
const categories: Ref<VaultMeta["category"][]> = ref([]);
const defaultConfigChanges: Ref<ConfigChanges> = ref({
  enabled: false,
  active: false,
  changes: Object.create({}),
});
const configChanges: Ref<ConfigChanges> = ref({
  enabled: false,
  active: false,
  changes: Object.create({}),
});

// Define states
const isAutoFarmingConfigLoaded = ref(false);

// Start fetching balance
if (isSignedIn) {
  // Fetch vault contract metadata
  fetchAutoFarmingConfig()
    .then(() => {
      isAutoFarmingConfigLoaded.value = true;
    })
    .catch((reason) => {
      isAutoFarmingConfigLoaded.value = false;
      logger.error("Failed to fetch auto-farming config", reason);
    });
}

// Check show loader or not
// const isShowAutoFarmingLoader = computed(() => {
//   return !isAutoFarmingConfigLoaded.value && isSignedIn;
// });

// Computed data
const isAutoFarmingAvailable = () => {
  // Compare `enabled` to check if there are any changes
  const hasEnabledChanged =
    configChanges.value.enabled !== defaultConfigChanges.value.enabled;
  if (hasEnabledChanged) {
    console.log(
      "[Auto-farming]: Has enabled changed",
      configChanges.value.enabled,
      defaultConfigChanges.value.enabled
    );
    return true;
  }

  // Compare categories to check if there are any changes
  const categories = Object.keys(
    configChanges.value.changes
  ) as VaultMeta["category"][];
  const defaultCategories = Object.keys(
    defaultConfigChanges.value.changes
  ) as VaultMeta["category"][];
  const hasCategoryChanged =
    categories.filter((x) => !defaultCategories.includes(x)).length > 0;
  if (hasCategoryChanged) {
    console.log(
      "[Auto-farming]: Has category changes",
      categories,
      defaultCategories
    );
    return true;
  }

  // Compare vaults to check if there are strategies changes
  let hasVaultChanged = false;
  for (const category of categories) {
    const vaults = configChanges.value.changes[category].strategies;
    const defaultVaults =
      defaultConfigChanges.value.changes[category].strategies;
    if (defaultVaults.filter((x) => !vaults.includes(x)).length > 0) {
      hasVaultChanged = true;
      break;
    }
  }
  if (hasVaultChanged) {
    console.log("[Auto-farming]: Has vault changes");
    return true;
  }

  // Compare vaults to check if there are cooldown changes
  let hasCooldownChanged = false;
  for (const category of categories) {
    const cooldown = configChanges.value.changes[category].cooldown;
    const defaultCooldown =
      defaultConfigChanges.value.changes[category].cooldown;
    if (cooldown !== defaultCooldown) {
      hasCooldownChanged = true;
      break;
    }
  }
  if (hasCooldownChanged) {
    console.log("[Auto-farming]: Has cooldown changes");
    return true;
  }

  return false;
};

// Getters
const vaultsByCategory = (category: VaultMeta["category"]) => {
  return vaults.value.filter((vault) => vault.meta.category === category);
};

const getCategoryLabel = (category: VaultMeta["category"]) => {
  // Category label text
  const categoryLabel = {
    StableStable: "Stable",
    StableUnstable: "Stable/Non-stable",
    UnstableUnstable: "Non-stable",
  }[category];

  // Get number of selected vaults in this category
  const selectedVaults = (
    configChanges.value.changes[category]?.strategies ?? []
  ).length;

  // Return label
  return `${categoryLabel} (${selectedVaults}/${
    vaultsByCategory(category).length
  })`;
};

const checkVaultActive = (vault: Vault) => {
  return configChanges.value.changes[vault.meta.category]?.strategies?.includes(
    vault.meta.contractId
  );
};

const formatAPY = (meta: VaultMeta) => {
  if (meta.apr.gte(Big(1000))) {
    return "1000%";
  }
  return `${Big(meta.bonusApr).add(aprToApy(meta.apr, 365)).toFixed(2)}%`;
};

// Listen for vault store changes
const vaultStore = useVaultStore();
watch(vaultStore.$state, async (state) => {
  // Set vaults
  vaults.value = state.vaults;

  // Get list of categories from vaults
  const allCategories: VaultMeta["category"][] = state.vaults.map(
    (vault) => vault.meta.category
  );

  // Filter categories
  const filteredCategories: VaultMeta["category"][] = allCategories.filter(
    (it) => it === "StableStable"
  );

  // Update value
  categories.value = [...new Set(filteredCategories)];
});

// Listen for auto-farming store changes
const autoFarmingStore = useAutoFarmingStore();
watch(autoFarmingStore.$state, async (state) => {
  // Create config changes
  const changes = {
    active: state.active,
    enabled: state.enabled,
    changes: Object.keys(state.config).reduce((acc, category) => {
      const strategyConfig: AutoFarmingConfig = state.config[
        category as VaultMeta["category"]
      ] ?? {
        strategies: [],
        cooldown: 1209600000000003, // 2 weeks
        unlock_at: 0,
      };

      acc[category] = {
        cooldown: strategyConfig.cooldown,
        strategies: strategyConfig.strategies,
      };
      return acc;
    }, Object.create({})),
  };

  // Set config changes
  defaultConfigChanges.value = JSON.parse(JSON.stringify(changes));
  configChanges.value = JSON.parse(JSON.stringify(changes));
});

// Buttons
function toggleVault(vault: Vault) {
  // Check if vault is active
  const isActive = checkVaultActive(vault);

  // Check that vault category is in config changes, create if not
  if (!configChanges.value.changes[vault.meta.category]) {
    configChanges.value.changes[vault.meta.category] = {
      cooldown: 1209600000000003, // 2 weeks
      strategies: [],
    };
  }

  // Remove vault from config changes if it's active
  if (isActive) {
    configChanges.value.changes[vault.meta.category].strategies =
      configChanges.value.changes[vault.meta.category].strategies.filter(
        (strategy) => strategy !== vault.meta.contractId
      );

    // Remove category from config changes if it's empty, and it is not included in default config changes
    if (
      configChanges.value.changes[vault.meta.category].strategies.length ===
        0 &&
      !defaultConfigChanges.value.changes[vault.meta.category]
    ) {
      delete configChanges.value.changes[vault.meta.category];
    }
  } else {
    // Add vault to config changes if it's not active
    configChanges.value.changes[vault.meta.category].strategies.push(
      vault.meta.contractId
    );
  }
}

async function handleAutoFarming() {
  return await updateAutoFarming(
    configChanges.value.enabled,
    configChanges.value.changes
  );
}
</script>

<style lang="scss" scoped>
.auto-farming {
  padding: 16px 24px;
  align-items: center;
  background-color: var(--background-color);
  box-shadow: 0px -4px 50px rgba(47, 91, 96, 0.08);
  border-radius: 4px;

  &__buttons {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }

  &__label {
    font-size: 16px;
    font-weight: 400;
    color: rgba(13, 13, 13, 0.3);
    margin-top: 12px;
    margin-bottom: 8px;
  }

  &__strategies {
    display: grid;
    grid-template-columns: 3fr 3fr;
    grid-template-rows: auto;
    row-gap: 12px;
    column-gap: 12px;
    align-items: stretch;
  }

  &__strategy {
    border: 2px solid rgba(211, 211, 211, 0.46);
    border-radius: 8px;
    background-color: white;
    padding: 6px;
    cursor: pointer;
    -webkit-user-select: none; /* Safari */
    user-select: none; /* Standard syntax */

    &.active {
      border: 2px solid rgb(49, 170, 183);
    }

    &__title {
      display: flex;
      flex-direction: row;
      align-items: center;

      &__label {
        font-size: 12px;
        font-weight: 500;
        padding-left: 4px;
      }

      &__logo {
        img {
          &:not(:last-child) {
            margin-right: -12px;
          }

          height: 24px;
          border: 2px solid rgba(211, 211, 211, 0.46);
          border-radius: 20px;
        }
      }
    }

    &__content {
      display: flex;
      margin-top: 6px;
      flex-direction: row;
      justify-content: space-between;

      &__info {
        display: flex;
        flex-direction: row;
        padding-right: 4px;

        img {
          width: 15px;
        }

        &__label {
          font-size: 13px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.3);
          text-transform: uppercase;
          margin-right: 4px;
        }

        &__text {
          font-size: 13px;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
