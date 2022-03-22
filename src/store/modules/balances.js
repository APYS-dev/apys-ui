import tokenMeta from '../../data/tokenMeta.json';
import {fromUnits, view} from '@/near/utils';

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
      const tokens = await window.contract.get_whitelisted_tokens();

      let app_deposits = tokens.reduce((acc, next) => {
        acc[next] = '0';
        return acc;
      }, {});

      if (window.accountId) { // todo: replace with global variable
        app_deposits = await view({
          args: {account_id: window.accountId},
          contractId: window.contract.contractId,
          methodName: 'get_deposits',
        });
      }

      const balances = tokens.map(async (token) => {
        const meta = tokenMeta[token];
        if (!meta) {
          return null;
        }

        let wallet_balance = '0';
        if (window.accountId) {
          wallet_balance = await view({
            args: {account_id: window.accountId},
            contractId: token,
            methodName: 'ft_balance_of',
          });
        }

        const appBalance = fromUnits(app_deposits[token] || 0, meta.decimals);
        const walletBalance = fromUnits(wallet_balance, meta.decimals);
        console.log('--------');
        console.log('token', token);
        console.log('balance', walletBalance);
        console.log('appBalance', appBalance);
        console.log('--------');
        return {
          token,
          appBalance,
          walletBalance,
          name: meta.symbol,
          logoUrl: meta.img,
        };
      });
      const res = (await Promise.all(balances)).filter((el) => !!el);
      context.commit('updateBalances', res);
    },
  },

  getters: {
    getBalances(state) {
      return state.balances;
    },
  },
};
