import vaults from '@/dataVaults.json';

export default {
  state: {
    vaults: [],
  },

  mutations: {
    updateVaults(state, vaults) {
      state.vaults = vaults;
    },
  },

  actions: {
    loadVaults(context) {
      const response = vaults;

      context.commit('updateVaults', response.vaults);
    },
  },

  getters: {
    getVaults(state) {
      return state.vaults;
    },
  },
};
