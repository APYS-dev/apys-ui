import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import getConfig from './config';
import tokenMeta from '@/data/tokenMeta.json';
import Big from 'big.js';

const nearConfig = getConfig(process.env.NODE_ENV || 'development');

export async function initContract() {
  const near = await connect(
    Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig)
  );

  window.walletConnection = new WalletConnection(near, null);

  window.accountId = window.walletConnection.getAccountId();

  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    viewMethods: ['get_whitelisted_tokens', 'get_user_actions'],
    changeMethods: ['start', 'withdraw'],
  });

  window.near = near;
}

export function logout() {
  window.walletConnection.signOut();
  window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
  window.walletConnection.requestSignIn(nearConfig.contractName);
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

export async function depositFt(ftContractId, amount) {
  const ftContract = await new Contract(window.walletConnection.account(), ftContractId, {
    viewMethods: [],
    changeMethods: ['ft_transfer_call'],
  });

  const meta = tokenMeta[ftContractId];

  console.log('ftContract.ft_transfer_call1', ftContract.ft_transfer_call);
  return ftContract.ft_transfer_call({
    args: {
      receiver_id: nearConfig.contractName,
      amount: toUnits(amount, meta.decimals),
      msg: '',
    },
    amount: 1,
    gas: 300000000000000,
  });
}

export async function withdrawFt(ftContractId, amount) {
  const meta = tokenMeta[ftContractId];
  return await window.contract.withdraw({
    args: {
      amount: toUnits(amount, meta.decimals),
      token_id: ftContractId,
    },
    amount: 1,
    gas: 300000000000000,
  });
}

export async function startStrategy(strategyId, ftContractId, amount) {
  const meta = tokenMeta[ftContractId];
  return await window.contract.start({
    args: {
      strategy_id: strategyId,
      balance: toUnits(amount, meta.decimals),
      token_id: ftContractId,
    },
    gas: 300000000000000,
  });
}

export function fromUnits(amount, decimals) {
  return Big(amount).div(new Big(10).pow(decimals)).toFixed(2);
}

export function toUnits(amount, decimals) {
  return Big(amount).mul(new Big(10).pow(decimals)).toFixed(0);
}
