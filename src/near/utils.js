import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import getConfig from './config';
import Big from 'big.js';
import { nearApi } from '@/near/NearApi';
import jwtEncode from 'jwt-encode';

const DEFAULT_GAS = '50000000000000';
const WITHDRAW_GAS = '100000000000000';
const STOP_STRATEGY_GAS = '200000000000000';
const ONE_YOCTO_NEAR = '0.000000000000000000000001';

const nearConfig = getConfig(process.env.VUE_APP_ENV || 'development');

export async function initContract(apysContractId) {
  const near = await connect(
    Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig)
  );

  window.walletConnection = new WalletConnection(near, null);

  window.accountId = window.walletConnection.getAccountId();

  window.apysContractId = apysContractId;

  window.contract = await new Contract(window.walletConnection.account(), apysContractId, {
    viewMethods: ['get_whitelisted_tokens', 'get_user_actions'],
    changeMethods: ['start', 'stop'],
  });

  window.near = near;
  return {
    walletConnection: window.walletConnection,
    accountId: window.accountId,
  };
}

export function logout() {
  window.walletConnection.signOut();
  window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
  window.walletConnection.requestSignIn();
}

export function view({ contractId, methodName, args = {} }) {
  const nearAPI = window.near;

  return nearAPI.connection.provider
    .query({
      account_id: contractId,
      args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
      finality: 'final',
      method_name: methodName,
      request_type: 'call_function',
    })
    .then(({ result }) => JSON.parse(Buffer.from(result).toString()));
}

async function checkNeedStorageDeposit(contractId = window.contract.contractId, accountId = window.accountId) {
  const balance = await view({
    contractId,
    methodName: 'storage_balance_of',
    args: {
      account_id: accountId,
    },
  });

  return !balance || balance.total === '0';
}

export async function depositFt(token, amount, walletBalance, appBalance) {
  const transactions = [];

  // Check storage deposit and create transaction if necessary
  const needStorageDeposit = await checkNeedStorageDeposit(window.apysContractId);
  if (needStorageDeposit) {
    const action = {
      amount: '0.01488',
      args: {},
      gas: DEFAULT_GAS,
      methodName: 'storage_deposit',
    };
    const transaction = await nearApi().actionsToTransaction(window.apysContractId, [action]);
    transactions.push(transaction);
  }

  // Create transfer transaction
  const transferAction = {
    args: {
      receiver_id: window.apysContractId,
      amount: toUnits(amount, token.decimals),
      msg: '',
    },
    gas: DEFAULT_GAS,
    amount: ONE_YOCTO_NEAR,
    methodName: 'ft_transfer_call',
  };
  const transferTransaction = await nearApi().actionsToTransaction(token.contractId, [transferAction]);
  transactions.push(transferTransaction);

  // Create meta with a new temporary balance
  const meta = jwtEncode(
    {
      deposit: {
        [token.contractId]: {
          oldWalletBalance: walletBalance,
          oldAppBalance: appBalance,
          amount,
        },
      },
    },
    ''
  );

  // Execute transactions
  return await nearApi().executeMultipleTransactions(transactions, meta);
}

export async function withdrawFt(token, amount, walletBalance, appBalance) {
  const transactions = [];

  // Check storage deposit and create transaction if necessary
  const needStorageDeposit = await checkNeedStorageDeposit(token.contractId);
  if (needStorageDeposit) {
    const action = {
      amount: '0.00125',
      args: {},
      gas: DEFAULT_GAS,
      methodName: 'storage_deposit',
    };
    const transaction = await nearApi().actionsToTransaction(token.contractId, [action]);
    transactions.push(transaction);
  }

  // Create transfer transaction
  const transferAction = {
    args: {
      token_id: token.contractId,
      amount: toUnits(amount, token.decimals),
    },
    amount: ONE_YOCTO_NEAR,
    gas: WITHDRAW_GAS,
    methodName: 'withdraw',
  };
  const transferTransaction = await nearApi().actionsToTransaction(window.apysContractId, [transferAction]);
  transactions.push(transferTransaction);

  // Create meta with a new temporary balance
  const meta = jwtEncode(
    {
      withdraw: {
        [token.contractId]: {
          oldWalletBalance: walletBalance,
          oldAppBalance: appBalance,
          amount,
        },
      },
    },
    ''
  );

  // Execute transactions
  return await nearApi().executeMultipleTransactions(transactions, meta);
}

export async function startStrategy(strategyId, token, amount, appBalance, vaultBalance) {
  const transactions = [];

  // Create transfer transaction
  const transferAction = {
    args: {
      strategy_id: strategyId,
      balance: toUnits(amount, token.decimals),
      token_id: token.contractId,
    },
    gas: 300000000000000,
    methodName: 'start',
  };
  const transferTransaction = await nearApi().actionsToTransaction(window.apysContractId, [transferAction]);
  transactions.push(transferTransaction);

  // Create meta with a new temporary balance
  const meta = jwtEncode(
    {
      vaultDeposit: {
        [token.contractId]: {
          strategyId,
          oldAppBalance: appBalance,
          oldVaultBalance: vaultBalance,
          amount,
        },
      },
    },
    ''
  );

  console.log('transactions', transactions);

  // Execute transactions
  return await nearApi().executeMultipleTransactions(transactions, meta);
}

export async function stopStrategy(strategyId, token) {
  const transactions = [];

  // Create transfer transaction
  const transferAction = {
    args: {
      token_id: token.contractId,
    },
    gas: STOP_STRATEGY_GAS,
    amount: ONE_YOCTO_NEAR,
    methodName: 'stop',
  };
  const transferTransaction = await nearApi().actionsToTransaction(strategyId, [transferAction]);
  transactions.push(transferTransaction);

  // Execute transactions
  return await nearApi().executeMultipleTransactions(transactions);
}

export async function checkTransactionReady(txHash) {
  try {
    const result = await window.near.connection.provider.txStatus(txHash, window.accountId);
    console.log('result', JSON.stringify(result));
    const status = result.status;
    return status['Failure'] !== undefined || status['SuccessValue'] !== undefined;
  } catch (err) {
    console.log('err:', err);
    return false;
  }
}

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function waitForTransactionReady(txHash) {
  const isReady = await checkTransactionReady(txHash);
  if (isReady) {
    return 0;
  }

  await timeout(250);
  return waitForTransactionReady(txHash);
}

export function fromUnits(amount, decimals) {
  return Big(amount).div(new Big(10).pow(decimals));
}

export function toUnits(amount, decimals) {
  return Big(amount).mul(new Big(10).pow(decimals)).toFixed(0);
}

export function aprToApy(apr, period) {
  return new Big(apr).div(100).div(period).plus(1).pow(period).minus(1).mul(100).toNumber();
}
