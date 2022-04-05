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
      // Get account balances
      let apysBalances = {
        balance: {},
        withdraw: {},
        deposit: {},
      };
      if (window.accountId) {
        apysBalances = await view({
          args: { account_id: window.accountId },
          contractId: window.apysContractId,
          methodName: 'get_balances',
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

        // Recalculate app balance using processing balances from APYS contract
        const apysBalance = apysBalances.balance[token.contractId] || 0;
        const depositAmount = apysBalances.deposit[token.contractId] || 0;
        const withdrawAmount = apysBalances.withdraw[token.contractId] || 0;

        // Calculate and format app balance
        const appBalance = fromUnits(apysBalance, token.decimals);

        const walletBalance = fromUnits(wallet_balance, token.decimals);
        console.log('--------');
        console.log('token', token.symbol);
        console.log('balance', walletBalance);
        console.log('apysBalance', appBalance);
        console.log('depositAmount', depositAmount);
        console.log('withdrawAmount', withdrawAmount);
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
            const strategyBalances = await view({
              args: { account_id: window.accountId },
              contractId,
              methodName: 'get_total_account_balances',
            });

            // Get APYS balance for strategy
            const apysBalances = await view({
              args: { account_id: window.accountId, strategy_id: contractId },
              contractId: window.apysContractId,
              methodName: 'get_strategy_balances',
            });

            // Summarize balances for each token
            const totalBalancesCost = depositTokens
              .map(({ contractId, decimals, price }) => {
                // Strategy contract amounts
                const strategyDepositAmount = Big(strategyBalances.deposit[contractId] ?? 0);
                const strategyWithdrawAmount = Big(strategyBalances.withdraw[contractId] ?? 0);

                // APYS contract amounts
                const apysDepositAmount = Big(apysBalances.deposit[contractId] ?? 0);
                const apysWithdrawAmount = Big(apysBalances.withdraw[contractId] ?? 0);

                // Format and return balance
                return Big(0)
                  .plus(strategyDepositAmount)
                  .plus(strategyWithdrawAmount)
                  .plus(apysDepositAmount)
                  .plus(apysWithdrawAmount)
                  .div(Big(10).pow(decimals))
                  .mul(price)
                  .toNumber();
              })
              .reduce((a, b) => a + b, 0);

            // Calculate shares cost
            const totalSharesCost = Big(strategyBalances.shares).div(Big(10).pow(18)).mul(osc).toNumber();

            // Calculate deposit amount
            const deposit = (totalBalancesCost + totalSharesCost).toFixed(2);

            // Calculate rewards amount
            const rewards = Big(strategyBalances.reward_shares).div(Big(10).pow(18)).mul(osc).toFixed(2);

            // Check stat strategy is processing
            const isProcessing =
              Object.values(strategyBalances.deposit).length > 0 ||
              Object.values(strategyBalances.withdraw).length > 0 ||
              Object.values(apysBalances.deposit).length > 0 ||
              Object.values(apysBalances.withdraw).length > 0;

            return { deposit, rewards, isProcessing };
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
