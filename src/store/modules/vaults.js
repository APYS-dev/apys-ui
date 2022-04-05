import { toRaw } from 'vue';
import { fromUnits, strategyGetDepositBalance } from '@/near/utils';

export default {
  state: {
    vaults: [],
    strategyBalances: {},
  },

  mutations: {
    updateVaults(state, vaults) {
      state.vaults = vaults;
    },
    updateStrategyBalances(state, actions) {
      state.strategyBalances = actions;
    },
  },

  actions: {
    initVaults(context, vaults) {
      context.commit('updateVaults', vaults);
    },
    async loadStrategyState(context) {
      if (!window.accountId) {
        return;
      }
      const vaultsArr = toRaw(context.getters.getVaults);

      const strategyBalances = {};
      for (const strategy of vaultsArr) {
        const strategyBalance = await strategyGetDepositBalance(strategy.contractId);
        const { external, internal } = strategyBalance;
        let strategyInternalBalance;
        let usedTokenId;
        for (const [tokenId, balance] of Object.entries({
          ...external,
          ...internal,
        })) {
          const token = strategy.depositTokens.find((t) => t.contractId === tokenId);
          strategyInternalBalance = fromUnits(balance, token.decimals);
          usedTokenId = tokenId;
        }
        strategyBalances[strategy.contractId] = {
          token_id: usedTokenId,
          amount: strategyInternalBalance,
        };
      }
      console.log('strategyBalances', strategyBalances);
      context.commit('updateStrategyBalances', strategyBalances);
    },
  },

  getters: {
    getVaults(state) {
      return state.vaults;
    },
    getStrategyBalances(state) {
      return state.strategyBalances;
    },
  },
};
