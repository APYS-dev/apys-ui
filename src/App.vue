<template>
  <TheHeader />
  <RouterView class="content" />
  <TheFooter />
  <ModalsContainer></ModalsContainer>
  <div id="endofbody"></div>
</template>

<script lang="ts">
import { RouterView } from "vue-router";
import { defineComponent } from "vue";
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import { useGeneralStore } from "@/stores/general";
import { useBalanceStore } from "@/stores/balance";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ModalsContainer } from "vue-final-modal";

export default defineComponent({
  name: "App",
  components: {
    TheFooter,
    TheHeader,
    RouterView,
    ModalsContainer,
  },

  setup() {
    return {
      isLoading: true,
    };
  },

  async mounted() {
    // Show full loading screen
    const loader = this.$loading.show({
      // Optional parameters
      container: undefined,
      canCancel: false,
      backgroundColor: "#FFF",
      opacity: 1,
      loader: "dots",
      color: "#08AEEA",
    });

    try {
      // Fetch general data from info server
      const generalStore = useGeneralStore();
      await generalStore.fetchInfo();

      // Star app initialization
      this.initApp();

      // Hide full loading screen
      this.isLoading = false;
      loader.hide();
    } catch (e) {
      console.error("Error fetching data", e);
    }
  },
  methods: {
    initApp() {
      // Get general store
      const { tokens } = useGeneralStore();

      // Init balances
      const { initBalancesByTokens } = useBalanceStore();
      initBalancesByTokens(tokens);
    },
  },
});
</script>

<style lang="scss">
.content {
  height: 100%;
}
</style>
