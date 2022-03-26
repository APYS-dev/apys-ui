import { fromUnits, view } from '@/near/utils';
import Big from 'big.js';
import { toPrecision } from '@/utils/math';

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
          strategies.map(async ({ contractId, depositTokens }) => {
            const depositBalance = await view({
              args: { account_id: window.accountId },
              contractId,
              methodName: 'get_account_deposit_balance',
            });
            const withdrawBalance = await view({
              args: { account_id: window.accountId },
              contractId,
              methodName: 'get_account_withdraw_balance',
            });

            // Find bigger decimal from tokens
            const biggerDecimal = Math.max(...depositTokens.map((it) => it.decimals));

            // Summarize balances for each token
            return depositTokens
              .map(({ contractId, decimals }) => {
                // Deposit balances
                const depositInternal = Big(depositBalance.internal[contractId] ?? 0);
                const depositExternal = Big(depositBalance.external[contractId] ?? 0);

                // Withdraw balances
                const withdrawInternal = Big(withdrawBalance.internal[contractId] ?? 0);
                const withdrawExternal = Big(withdrawBalance.external[contractId] ?? 0);

                // Calculate total balance
                const totalBalance = depositInternal
                  .plus(depositExternal)
                  .plus(withdrawInternal)
                  .plus(withdrawExternal);

                // Format by bigger decimals and return balance
                return toPrecision(totalBalance.div(new Big(10).pow(decimals)), decimals, biggerDecimal).toNumber();
              })
              .reduce((a, b) => a + b, 0);
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
