import { createApp } from "vue";
import { createPinia } from "pinia";
import VueLoading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { vfmPlugin } from "vue-final-modal";
import { createLogger } from "vue-logger-plugin";

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

app.mount("#app");
