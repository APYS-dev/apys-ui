import { createStore } from 'vuex';
import balances from './modules/balances';
import totalTVL from './modules/totalTVL';
import vaults from './modules/vaults';

export default createStore({
  modules: {
    balances,
    totalTVL,
    vaults,
  },
});
