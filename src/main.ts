import { createApp } from "vue";
import { createPinia } from "pinia";
import VueLoading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { vfmPlugin } from "vue-final-modal";
import { createLogger } from "vue-logger-plugin";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import ModalDepositToVault from "@/modals/ModalDepositToVault.vue";
import ModalWithdrawFromVault from "@/modals/ModalWithdrawFromVault.vue";
import ModalApyCalculator from "@/modals/ModalApyCalculator.vue";
import ModalRewardsInfo from "@/modals/ModalRewardsInfo.vue";
import ModalApyInfo from "@/modals/ModalApyInfo.vue";
import AmountInputField from "@/components/input/AmountInputField.vue";
import DropDown from "@/components/DropDown.vue";
import Vue3Autocounter from "vue3-autocounter";
import { Buffer } from "buffer";

import "@/assets/styles/main.scss";

import App from "./App.vue";
import router from "./router";

window.Buffer = Buffer;

const app = createApp(App);

app
  .use(createPinia())
  .use(router)
  .use(VueLoading)
  .use(createLogger({}))
  .use(
    createVuetify({
      components,
      directives,
    })
  )
  .use(
    vfmPlugin({
      key: "$vfm",
      componentName: "VueFinalModal",
      dynamicContainerName: "ModalsContainer",
    })
  );

// Register modals
app.component("ModalDepositToVault", ModalDepositToVault);
app.component("ModalWithdrawFromVault", ModalWithdrawFromVault);
app.component("ModalApyCalculator", ModalApyCalculator);
app.component("ModalRewardsInfo", ModalRewardsInfo);
app.component("ModalApyInfo", ModalApyInfo);

// Register global components
app.component("DropDown", DropDown);
app.component("Vue3Autocounter", Vue3Autocounter);
app.component("AmountInputField", AmountInputField);

app.mount("#app");
