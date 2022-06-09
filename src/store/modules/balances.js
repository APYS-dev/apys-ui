import { fromUnits, view } from '@/near/utils';
import Big from 'big.js';

export default {
  state: {
    tokens: [],
    balances: [],
    vaultsBalances: {},
  },

  mutations: {
    updateTokens(state, tokens) {
      state.tokens = tokens;
    },
    updateBalances(state, balances) {
      state.balances = balances;
    },
    updateVaultsBalances(state, vaultsBalances) {
      state.vaultsBalances = vaultsBalances;
    },
  },

  actions: {
    initTokens(context, tokens) {
      context.commit('updateTokens', tokens);
    },
    async loadBalances(context, transactionMeta) {
      // Return empty balances if no account
      if (!window.accountId) {
        const balances = context.state.tokens.map((token) => ({
          token,
          appBalance: '0',
          walletBalance: '0',
        }));

        context.commit('updateBalances', balances);
        return;
      }

      // Get account balances
      const apysBalances = await view({
        args: { account_id: window.accountId },
        contractId: window.apysContractId,
        methodName: 'get_balances',
      });

      console.log('apysBalances', apysBalances);

      const balances = await Promise.all(
        context.state.tokens.map(async (token) => {
          const wallet_balance = await view({
            args: { account_id: window.accountId },
            contractId: token.contractId,
            methodName: 'ft_balance_of',
          });

          // Recalculate app balance using processing balances from APYS contract
          const apysBalance = Big(apysBalances.balance[token.contractId] || 0);
          const depositAmount = Big(apysBalances.deposit[token.contractId] || 0);

          console.log(`\n\n ${token.contractId} apysBalance: ${apysBalance}\n depositAmount: ${depositAmount}\n\n`);

          // Calculate and format app balance
          let appBalance = fromUnits(apysBalance, token.decimals).toString();
          const appRawBalance = apysBalances.balance[token.contractId] || '0';

          // Get wallet balance
          let walletBalance = fromUnits(wallet_balance, token.decimals).toString();

          // Check that balance is updated, if not, just update by transactionMeta
          if (transactionMeta && Object.keys(transactionMeta).length > 0) {
            // Check deposit transaction
            if (transactionMeta.deposit && transactionMeta.deposit[token.contractId]) {
              console.warn(
                'TRIGGERED DEPOSIT',
                `wallet: ${walletBalance} appBalance: ${appBalance}\n transactionMeta: ${JSON.stringify(
                  transactionMeta
                )}`
              );

              // Get transaction amounts
              const amounts = transactionMeta.deposit[token.contractId];
              if (walletBalance === amounts.oldWalletBalance) {
                walletBalance = Big(walletBalance).minus(amounts.amount).toString();
              }
              if (appBalance === amounts.oldAppBalance) {
                appBalance = Big(appBalance).plus(amounts.amount).toString();
              }
            }

            // Check withdraw transaction
            if (transactionMeta.withdraw && transactionMeta.withdraw[token.contractId]) {
              console.warn(
                'TRIGGERED WITHDRAW',
                `wallet: ${walletBalance} appBalance: ${appBalance}\n transactionMeta: ${JSON.stringify(
                  transactionMeta
                )}`
              );

              // Get transaction amounts
              const amounts = transactionMeta.withdraw[token.contractId];
              if (walletBalance === amounts.oldWalletBalance) {
                walletBalance = Big(walletBalance).plus(amounts.amount).toString();
              }
              if (appBalance === amounts.oldAppBalance) {
                appBalance = Big(appBalance).minus(amounts.amount).toString();
              }
            }

            // Check vault transaction
            if (transactionMeta.vaultDeposit && transactionMeta.vaultDeposit[token.contractId]) {
              console.warn(
                'TRIGGERED VAULT DEPOSIT',
                `wallet: ${walletBalance} appBalance: ${appBalance}\n transactionMeta: ${JSON.stringify(
                  transactionMeta
                )}`
              );

              // Get transaction amounts
              const amounts = transactionMeta.vaultDeposit[token.contractId];
              if (appBalance === amounts.oldAppBalance) {
                appBalance = Big(appBalance).minus(amounts.amount).toString();
              }
            }
          }

          // Print debug data
          console.log('--------');
          console.log('token', token.symbol);
          console.log('balance', walletBalance);
          console.log('raw balance', wallet_balance);
          console.log('apysBalance', appBalance);
          console.log('appRawBalance', appRawBalance);
          console.log('depositAmount', depositAmount.toFixed(4));
          console.log('--------');
          return {
            appBalance,
            appRawBalance,
            walletBalance,
            token,
            rawBalance: wallet_balance
          };
        })
      );

      console.log('valances', balances);

      context.commit('updateBalances', balances);
    },
    async loadVaultsBalances(context, { strategies, transactionMeta }) {
      const vaultsUUIDs = strategies.map((it) => it.uuid);

      // Get shares from contract
      if (window.accountId) {
        const fetchedBalances = await Promise.all(
          strategies.map(async ({ contractId, depositTokens, osc, status }) => {
            // Skip fetching balances for [coming] status
            if (status === 'upcoming') {
              return { deposit: 0, rewards: 0, isProcessing: false };
            }

            // Get strategy balance
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

                // Format and return balance
                return Big(0)
                  .plus(strategyDepositAmount)
                  .plus(strategyWithdrawAmount)
                  .plus(apysDepositAmount)
                  .div(Big(10).pow(decimals))
                  .mul(price)
                  .toNumber();
              })
              .reduce((a, b) => a + b, 0);

            // Calculate shares cost
            const totalSharesCost = Big(strategyBalances.shares)
              .plus(strategyBalances.staked_shares)
              .div(Big(10).pow(18))
              .mul(osc)
              .toNumber();

            // Check transaction meta
            let depositAmountDiff = 0;
            if (
              transactionMeta &&
              transactionMeta.vaultDeposit &&
              Object.keys(transactionMeta.vaultDeposit).length > 0
            ) {
              console.log('transactionMeta', transactionMeta);

              // Skip if the strategy not same
              if (Object.values(transactionMeta.vaultDeposit)[0].strategyId !== contractId) {
                return;
              }

              console.warn(
                'TRIGGERED VAULT DEPOSIT UPDATE',
                `deposit: ${(totalBalancesCost + totalSharesCost).toFixed(2)}\n transactionMeta: ${JSON.stringify(
                  transactionMeta
                )}`
              );

              // Calculate current deposit
              const deposit = (totalBalancesCost + totalSharesCost).toFixed(2);

              // Get transaction amounts
              const amounts = Object.values(transactionMeta.vaultDeposit)[0];
              if (deposit === amounts.oldVaultBalance) {
                depositAmountDiff = amounts.amount;
              }
            }

            // Calculate deposit amount
            const deposit = (totalBalancesCost + totalSharesCost + depositAmountDiff).toFixed(2);

            // Calculate rewards amount
            const rewards = Big(strategyBalances.reward_shares).div(Big(10).pow(18)).mul(osc).toFixed(2);

            // Check stat strategy is processing
            const isProcessing =
              Object.values(strategyBalances.deposit).length > 0 ||
              Object.values(strategyBalances.withdraw).length > 0 ||
              Object.values(apysBalances.deposit).length > 0 ||
              Number(strategyBalances.shares) > 0;

            return { deposit, rewards, isProcessing };
          })
        );

        const vaultsBalances = Object.create({});
        fetchedBalances.forEach((contractBalance, index) => {
          vaultsBalances[vaultsUUIDs[index]] = contractBalance;
        });

        // Update vaults balances in state
        context.commit('updateVaultsBalances', vaultsBalances);
        return;
      }

      // Create balances for not authorised account
      const vaultsBalances = Object.create({});
      vaultsUUIDs.forEach((uuid) => {
        vaultsBalances[uuid] = {
          deposit: 0,
          rewards: 0,
          isProcessing: false,
        };
      });

      console.log('vaultsBalances', vaultsBalances);

      // Update vaults balances in state
      context.commit('updateVaultsBalances', vaultsBalances);
    },
  },

  getters: {
    getTokens(state) {
      return state.tokens;
    },
    getBalances(state) {
      return state.balances;
    },
    getVaultsBalances(state) {
      return state.vaultsBalances;
    },
  },
};
