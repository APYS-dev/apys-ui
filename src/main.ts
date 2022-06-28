import { createApp } from "vue";
import { createPinia } from "pinia";
import VueLoading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { vfmPlugin } from "vue-final-modal";
import { createLogger } from "vue-logger-plugin";
import ModalDepositFromBalance from "@/modals/ModalDepositFromBalance.vue";
import ModalWithdrawFromBalance from "@/modals/ModalWithdrawFromBalance.vue";
import ModalDepositFromVault from "@/modals/ModalDepositFromVault.vue";
import ModalWithdrawFromVault from "@/modals/ModalWithdrawFromVault.vue";
import DropDown from "@/components/DropDown.vue";

import "@/assets/styles/main.scss";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app
  .use(createPinia())
  .use(router)
  .use(VueLoading)
  .use(createLogger({}))
  .use(
    vfmPlugin({
      key: "$vfm",
      componentName: "VueFinalModal",
      dynamicContainerName: "ModalsContainer",
    })
  );

// Register modals
app.component("ModalDepositFromBalance", ModalDepositFromBalance);
app.component("ModalWithdrawFromBalance", ModalWithdrawFromBalance);
app.component("ModalDepositFromVault", ModalDepositFromVault);
app.component("ModalWithdrawFromVault", ModalWithdrawFromVault);

// Register global components
app.component("DropDown", DropDown);

app.mount("#app");
