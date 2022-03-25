import {toRaw} from "vue";
import {fromUnits} from "@/near/utils";

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
    initVaults(context, vaults) {
      context.commit('updateVaults', vaults);
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

        const userActions = {};
        const actionsRes = await Promise.all(getActionsPromises);
        // todo: replace this logic when we have one more strategy
        for (let i = 0; i < tokens.length; i++) {
          const actionsByToken = actionsRes[i];
          const {tokenId, decimals} = tokens[i];

          for (const action of actionsByToken) {
            if (action.account_id === window.accountId) {
              userActions[action.strategy_id] = {
                token_id: tokenId,
                amount: fromUnits(action.amount, decimals),
              };
            }
          }
        }

        context.commit('updateUserActions', userActions);
      }
    },
  },

  getters: {
    getVaults(state) {
      return state.vaults;
    },
    getUserActions(state) {
      return state.userActions;
    },
  },
};
