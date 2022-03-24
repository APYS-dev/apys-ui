import axios from 'axios';
import {toRaw} from "vue";

export default {
  state: {
    vaults: [],
    userActions: {},
  },

  mutations: {
    updateVaults(state, vaults) {
      state.vaults = vaults;
    },
    updateUserActions(state, actions) {
      state.userActions = actions;
    },
  },

  actions: {
    async loadVaults(context) {
      const response = await axios.get('http://localhost:3060/info');
      console.log(response.data);
      if (response.data) {
        context.commit('updateVaults', response.data.strategies);
      }
    },
    async loadUserActions(context) {
      if (window.accountId) {
        const vaultsArr = toRaw(context.getters.getVaults);
        for (const strategy of vaultsArr) {
          for (const token_id of strategy.depositTokens) {
            console.log(`${strategy.contractId} - ${token_id}`);
          }
        }

        const response = await window.contract.get_user_actions({'strategy_id':'stable-farm.box_sand.testnet', 'token_id': 'usdt.box_sand.testnet'});
        console.log('loadUserActions res: ', response);

        context.commit('updateUserActions', {});
      }
    },
  },

  getters: {
    getVaults(state) {
      return state.vaults;
    },
  },
};
