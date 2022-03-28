import { fromUnits, view } from '@/near/utils';
import Big from 'big.js';

export default {
  state: {
    tokens: [],
    balances: [],
    shares: {},
    vaultsBalances: {},
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
    updateVaultsBalances(state, vaultsBalances) {
      state.vaultsBalances = vaultsBalances;
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
    async loadVaultsBalances(context, strategies) {
      const vaultsContractsIds = strategies.map((it) => it.contractId);

      // Get shares from contract
      if (window.accountId) {
        const fetchedBalances = await Promise.all(
          strategies.map(async ({ contractId, depositTokens, osc }) => {
            const totalBalances = await view({
              args: { account_id: window.accountId },
              contractId,
              methodName: 'get_total_account_balances',
            });

            // Summarize balances for each token
            const totalBalancesCost = depositTokens
              .map(({ tokenContractId, decimals, price }) => {
                const amount = Big(totalBalances.amounts[tokenContractId] ?? 0);

                // Format and return balance
                return amount.div(Big(10).pow(decimals)).mul(price).toNumber();
              })
              .reduce((a, b) => a + b, 0);


            console.log('osc', osc);
            // Calculate shares cost
            const totalSharesCost = Big(totalBalances.shares).div(Big(10).pow(18)).mul(osc).toNumber();

            console.log(totalBalancesCost, totalSharesCost);

            // Calculate deposit amount
            const deposit = (totalBalancesCost + totalSharesCost).toFixed(2);

            // Calculate rewards amount
            const rewards = Big(totalBalances.reward_shares).div(Big(10).pow(18)).mul(osc).toFixed(2);

            return { deposit, rewards };
          })
        );

        const vaultsBalances = {};
        fetchedBalances.forEach((contractBalance, index) => {
          vaultsBalances[vaultsContractsIds[index]] = contractBalance;
        });

        console.log('vaultsBalances', vaultsBalances);

        // Update vaults balances in state
        context.commit('updateVaultsBalances', vaultsBalances);
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
    getVaultsBalances(state) {
      return state.vaultsBalances;
    },
  },
};
