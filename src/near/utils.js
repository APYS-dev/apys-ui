import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import getConfig from './config';
import Big from 'big.js';
import { nearApi } from '@/near/NearApi';

const DEFAULT_GAS = '50000000000000';
const WITHDRAW_GAS = '100000000000000';
const ONE_YOCTO_NEAR = '0.000000000000000000000001';

const nearConfig = getConfig(process.env.NODE_ENV || 'development');

export async function initContract(apysContractId) {
  const near = await connect(
    Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig)
  );

  window.walletConnection = new WalletConnection(near, null);

  window.accountId = window.walletConnection.getAccountId();

  window.apysContractId = apysContractId;

  window.contract = await new Contract(window.walletConnection.account(), apysContractId, {
    viewMethods: ['get_whitelisted_tokens', 'get_user_actions'],
    changeMethods: ['start', 'withdraw'],
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

export async function depositFt(token, amount) {
  const transactions = [];

  // Check storage deposit and create transaction if necessary
  const needStorageDeposit = await checkNeedStorageDeposit(window.apysContractId);
  if (needStorageDeposit) {
    const action = {
      amount: '0.01',
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

  // Execute transactions
  return await nearApi().executeMultipleTransactions(transactions);
}

export async function withdrawFt(token, amount) {
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

  // Execute transactions
  return await nearApi().executeMultipleTransactions(transactions);
}

export async function strategyGetDepositBalance(strategyContractId) {
  const strategyContract = await new Contract(window.walletConnection.account(), strategyContractId, {
    viewMethods: ['get_account_deposit_balance'],
    changeMethods: [],
  });

  return strategyContract.get_account_deposit_balance({
    account_id: window.accountId,
  });
}

export async function startStrategy(strategyId, token, amount) {
  return await window.contract.start({
    args: {
      strategy_id: strategyId,
      balance: toUnits(amount, token.decimals),
      token_id: token.contractId,
    },
    gas: 300000000000000,
  });
}

export async function checkTransactionReady(txHash) {
  const result = await window.near.connection.provider.txStatus(txHash, window.accountId);
  console.log('result', JSON.stringify(result));
  const status = result.status;
  return status['Failure'] !== undefined || status['SuccessValue'] !== undefined;
}

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function waitForTransactionReady(txHash) {
  const isReady = await checkTransactionReady(txHash);
  if (isReady) {
    console.log('READY');
    return 0;
  }

  await timeout(500);
  return waitForTransactionReady(txHash);
}

export function fromUnits(amount, decimals) {
  return Big(amount).div(new Big(10).pow(decimals)).toFixed(2);
}

export function toUnits(amount, decimals) {
  return Big(amount).mul(new Big(10).pow(decimals)).toFixed(0);
}
