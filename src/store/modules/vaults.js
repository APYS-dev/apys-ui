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
    initVaults(context, vaults) {
      context.commit('updateVaults', vaults);
    },
  },

  getters: {
    getVaults(state) {
      return state.vaults;
    },
  },
};
