import { fromUnits, view } from '@/near/utils';

export default {
  state: {
    tokens: [],
    balances: [],
    shares: {
      staked_shares: '0',
      reward_shares: '0',
    },
  },

  mutations: {
    updateTokens(state, tokens) {
      state.tokens = tokens;
    },
    updateBalances(state, balances) {
      state.balances = balances;
    },
    updateShares(state, shares) {
      state.shares = shares;
    },
  },

  actions: {
    initTokens(context, tokens) {
      context.commit('updateTokens', tokens);
    },
    async loadBalances(context) {
      let app_deposits = context.state.tokens.reduce((acc, next) => {
        acc[next.symbol] = '0';
        return acc;
      }, {});

      if (window.accountId) {
        // todo: replace with global variable
        app_deposits = await view({
          args: { account_id: window.accountId },
          contractId: window.contract.contractId,
          methodName: 'get_deposits',
        });
      }

      const balances = context.state.tokens.map(async (token) => {
        let wallet_balance = '0';
        if (window.accountId) {
          wallet_balance = await view({
            args: { account_id: window.accountId },
            contractId: token.contractId,
            methodName: 'ft_balance_of',
          });
        }

        const appBalance = fromUnits(app_deposits[token.contractId] || 0, token.decimals);
        const walletBalance = fromUnits(wallet_balance, token.decimals);
        console.log('--------');
        console.log('token', token.symbol);
        console.log('balance', walletBalance);
        console.log('appBalance', appBalance);
        console.log('--------');
        return {
          appBalance,
          walletBalance,
          token,
        };
      });
      const res = (await Promise.all(balances)).filter((el) => !!el);
      context.commit('updateBalances', res);
    },
    async loadShares(context, vaultsContractsIds) {
      // Get shares from contract
      if (window.accountId) {
        const fetchedShares = await Promise.all(
          vaultsContractsIds.map((contractId) =>
            view({
              args: { account_id: window.accountId },
              contractId,
              methodName: 'get_account_shares',
            })
          )
        );

        const shares = {};
        fetchedShares.forEach((contractShares, index) => {
          shares[vaultsContractsIds[index]] = contractShares;
        });

        // Update shares in state
        context.commit('updateShares', shares);
      }
    },
  },

  getters: {
    getTokens(state) {
      return state.tokens;
    },
    getBalances(state) {
      return state.balances;
    },
    getShares(state) {
      return state.shares;
    },
  },
};
