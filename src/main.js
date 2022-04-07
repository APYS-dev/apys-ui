import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import formatters from './formatters.js';
import uniqueId from './vueUniqueId';
import { vfmPlugin } from 'vue-final-modal';

import gTooltip from '@/components/G-tooltip.vue';
import gDropdown from '@/components/G-dropdown.vue';
import gModal from '@/components/G-modal.vue';
import gAutonumeric from '@/components/G-autonumeric.vue';

import './assets/styles/main.scss';

const app = createApp(App);
app
  .use(store)
  .use(router)
  .use(formatters)
  .use(uniqueId)
  .use(
    vfmPlugin({
      key: '$vfm',
      componentName: 'VueFinalModal',
      dynamicContainerName: 'ModalsContainer',
    })
  );

app.component('GDropdown', gDropdown);
app.component('GModal', gModal);
app.component('GTooltip', gTooltip);
app.component('GAutonumeric', gAutonumeric);

app.mount('#app');
