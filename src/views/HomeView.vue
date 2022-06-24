<template>
  <div class="container">
    <main>
      <div class="col-4 col-md-6 col-sm-12">
        <TotalTVL />
        <BalancesList />
      </div>
      <div class="col-8 col-md-12">
        <!--        <vaults></vaults>-->
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import BalancesList from "@/components/BalancesList.vue";
import TotalTVL from "@/components/TotalTVL.vue";

defineComponent({
  data() {
    return {
      message: "Hello!",
    };
  },
});
</script>
