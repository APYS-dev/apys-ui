import { Buffer } from 'buffer';
import { createTransaction, functionCall } from 'near-api-js/lib/transaction';
import { baseDecode } from 'borsh';
import { PublicKey } from 'near-api-js/lib/utils';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import BN from 'bn.js';

class NearApi {
  constructor() {
    this.near = window.near;
    this.wallet = window.walletConnection;
  }

  static getGas(gas) {
    return gas ? new BN(gas) : new BN('100000000000000');
  }

  viewFunction(contractId, methodName, args) {
    return this.near.connection.provider
      .query({
        account_id: contractId,
        args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
        finality: 'final',
        method_name: methodName,
        request_type: 'call_function',
      })
      .then((value) => JSON.parse(Buffer.from(value.result).toString()));
  }

  executeMultipleTransactions(transactions, meta = {}) {
    return this.wallet.requestSignTransactions({ transactions, meta });
  }

  async actionsToTransaction(receiverId, actions) {
    return await this.createTransaction(
      receiverId,
      actions.map((action) =>
        functionCall(action.methodName, action.args, NearApi.getGas(action.gas), this.getAmount(action.amount))
      )
    );
  }

  async createTransaction(receiverId, actions, nonceOffset = 1) {
    const account = this.wallet.account();
    const connection = this.wallet.account().connection;

    const localKey = await connection.signer.getPublicKey(account.accountId, connection.networkId);

    const accessKey = await account.accessKeyForTransaction(receiverId, actions, localKey);

    if (!accessKey) {
      throw new Error(`Cannot find matching key for transaction sent to ${receiverId}`);
    }

    const block = await connection.provider.block({ finality: 'final' });
    const blockHash = baseDecode(block.header.hash);

    const publicKey = PublicKey.from(accessKey.public_key);
    const nonce = accessKey.access_key.nonce + nonceOffset;

    return createTransaction(account.accountId, publicKey, receiverId, nonce, actions, blockHash);
  }

  getAmount(amount) {
    const parsedAmount = parseNearAmount(amount);
    return amount && parsedAmount ? new BN(parsedAmount) : new BN('0');
  }
}

export const nearApi = () => new NearApi();
