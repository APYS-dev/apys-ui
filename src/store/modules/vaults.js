import axios from "axios";

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
    async loadVaults(context) {
      const response = await axios.get("http://localhost:3060/info");
      console.log(response.data);
      if (response.data) {
        context.commit('updateVaults', response.data.strategies);
      }

    },
  },

  getters: {
    getVaults(state) {
      return state.vaults;
    },
  },
};
