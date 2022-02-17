import balances from '@/dataBalances.json';

export default {
  state: {
    balances: [],
  },

  mutations: {
    updateBalances(state, balances) {
      state.balances = balances;
    },
  },

  actions: {
    async loadBalances(context) {
      const response = balances;

      context.commit('updateBalances', response.balances);
    },
  },

  getters: {
    getBalances(state) {
      return state.balances;
    },
  },
};
