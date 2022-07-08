<template>
  <div class="vault-wrap">
    <VaultCardTitle :meta="vault.meta" />
    <VaultCardDetails :vault="vault" />
  </div>
</template>

<script setup lang="ts">
import { useLogger } from "vue-logger-plugin";
import VaultCardTitle from "@/components/vault/VaultCardTitle.vue";
import type { Vault } from "@/stores/types";
import VaultCardDetails from "@/components/vault/VaultCardDetails.vue";

const logger = useLogger();

// Define props
const props = defineProps<{
  vault: Vault;
}>();
</script>

<style lang="scss" scoped>
.vault-wrap {
  overflow: hidden;
  box-shadow: 0px -4px 50px rgba(47, 91, 96, 0.08);

  &:not(:first-child) {
    margin: 16px auto 0;
  }
}
</style>
