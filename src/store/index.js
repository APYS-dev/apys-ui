import { createStore } from 'vuex';
import balances from './modules/balances';
import vaults from './modules/vaults';

export default createStore({
  modules: {
    balances,
    vaults,
  },
});
