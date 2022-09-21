<template>
  <div class="container">
    <main>
      <div class="col-4 col-md-6 col-sm-12">
        <TotalTVL />
        <AutoFarming />
      </div>
      <div class="col-8 col-md-12">
        <VaultsList />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import TotalTVL from "@/components/TotalTVL.vue";
import VaultsList from "@/components/vault/VaultsList.vue";
import AutoFarming from "@/components/AutoFarming.vue";

defineComponent({
  data() {
    return {
      message: "Hello!",
    };
  },
});
</script>

<style lang="scss" scoped>
main {
  margin-left: -8px;
  margin-right: -8px;
  display: flex;
  flex-wrap: wrap;
  row-gap: 12px;

  & > div {
    min-width: 320px;
  }
}
</style>
