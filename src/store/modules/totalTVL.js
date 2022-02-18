import totalTVL from '@/dataTotalTVL.json';

export default {
  state: {
    totalTVL: 0,
  },

  mutations: {
    updateTotalTVL(state, totalTVL) {
      state.totalTVL = totalTVL;
    },
  },

  actions: {
    loadTotalTVL(context) {
      const response = totalTVL;

      context.commit('updateTotalTVL', response.totalTvl);
    },
  },

  getters: {
    getTotalTVL(state) {
      return state.totalTVL;
    },
  },
};
