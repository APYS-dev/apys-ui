import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import formatters from './formatters.js';
import uniqueId from './vueUniqueId';
import { vfmPlugin } from 'vue-final-modal';

import gDropdown from '@/components/G-dropdown.vue';
import gModal from '@/components/G-modal.vue';

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

app.mount('#app');
