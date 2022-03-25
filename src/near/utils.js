import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import getConfig from './config';
import Big from 'big.js';

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

export async function depositFt(token, amount) {
  const ftContract = await new Contract(window.walletConnection.account(), token.contractId, {
    viewMethods: [],
    changeMethods: ['ft_transfer_call'],
  });

  console.log('ftContract.ft_transfer_call1', ftContract.ft_transfer_call);
  return ftContract.ft_transfer_call({
    args: {
      receiver_id: window.apysContractId,
      amount: toUnits(amount, token.decimals),
      msg: '',
    },
    amount: 1,
    gas: 300000000000000,
  });
}

export async function withdrawFt(token, amount) {
  return await window.contract.withdraw({
    args: {
      amount: toUnits(amount, token.decimals),
      token_id: token.contractId,
    },
    amount: 1,
    gas: 300000000000000,
  });
}

export async function strategyGetDepositBalance(strategyContractId) {
  const strategyContract = await new Contract(window.walletConnection.account(), strategyContractId, {
    viewMethods: ['get_account_deposit_balance'],
    changeMethods: [],
  });

  return strategyContract.get_account_deposit_balance({ account_id: window.accountId });
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

export function fromUnits(amount, decimals) {
  return Big(amount).div(new Big(10).pow(decimals)).toFixed(2);
}

export function toUnits(amount, decimals) {
  return Big(amount).mul(new Big(10).pow(decimals)).toFixed(0);
}
