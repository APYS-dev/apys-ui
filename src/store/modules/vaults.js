import {toRaw} from "vue";
import {fromUnits, strategyGetDepositBalance} from "@/near/utils";

export default {
  state: {
    vaults: [],
    depositAction: {},
    strategyBalances: {},
  },

  mutations: {
    updateVaults(state, vaults) {
      state.vaults = vaults;
    },
    updateUserActions(state, actions) {
      state.depositAction = actions;
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
      const vaultsArr = toRaw(context.getters.getVaults);

      const strategyBalances = {};
      for (const strategy of vaultsArr) {
        const strategyBalance = await strategyGetDepositBalance(strategy.contractId);
        const { external, internal } = strategyBalance;
        let strategyInternalBalance;
        let usedTokenId;
        for (const [tokenId, balance] of Object.entries({ ...external, ...internal })) {
          const token = strategy.depositTokens.find(t => t.contractId === tokenId);
          strategyInternalBalance = fromUnits(balance, token.decimals);
          usedTokenId = tokenId;
        }
        strategyBalances[strategy.contractId] = {
          token_id: usedTokenId,
          amount: strategyInternalBalance,
        };
      }
      context.commit('updateStrategyBalances', strategyBalances);
    },
    async loadUserActions(context) {
      if (window.accountId) {
        const vaultsArr = toRaw(context.getters.getVaults);

        const getActionsPromises = [];
        const tokens = [];
        for (const strategy of vaultsArr) {
          for (const token of strategy.depositTokens) {
            tokens.push({tokenId: token.contractId, decimals: token.decimals});
            getActionsPromises.push(
              window.contract.get_user_actions({
                'strategy_id': strategy.contractId,
                'token_id': token.contractId,
              })
            );
          }
        }

        const depositAction = {};
        const actionsRes = await Promise.all(getActionsPromises);
        // todo: replace this logic when we have one more strategy
        for (let i = 0; i < tokens.length; i++) {
          const actionsByToken = actionsRes[i];
          const {tokenId, decimals} = tokens[i];

          for (const action of actionsByToken) {
            if (action.account_id === window.accountId) {
              depositAction[action.strategy_id] = {
                token_id: tokenId,
                amount: fromUnits(action.amount, decimals),
              };
            }
          }
        }

        context.commit('updateUserActions', depositAction);
      }
    },
  },

  getters: {
    getVaults(state) {
      return state.vaults;
    },
    getDepositAction(state) {
      return state.depositAction;
    },
    getStrategyBalances(state) {
      return state.strategyBalances;
    },
  },
};
