import { keyStores, Near, WalletConnection } from "near-api-js";
import {
  Action,
  functionCall,
  createTransaction,
  Transaction,
} from "near-api-js/lib/transaction";
import type Big from "big.js";
import { baseDecode } from "borsh";
import { PublicKey } from "near-api-js/lib/utils";
import type { CodeResult } from "near-api-js/lib/providers/provider";

export type NearViewOptions = {
  contractId: string;
  methodName: string;
  args: Record<string, unknown>;
};

export type NearCallOptions = {
  contractId: string;
  methodName: string;
  args: Record<string, unknown>;
  gas: Big;
  deposit: Big;
};

export type NearAction = {
  methodName: string;
  args: Record<string, unknown>;
  gas: Big;
  deposit: Big;
};

class NearApi {
  public readonly near: Near;
  public readonly wallet: WalletConnection;

  constructor() {
    this.near = new Near({
      headers: {},
      helperUrl: import.meta.env.VITE_NEAR_HELPER_URL,
      keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      networkId: import.meta.env.VITE_NEAR_NETWORK_IDN,
      walletUrl: import.meta.env.VITE_NEAR_WALLET_URL,
      nodeUrl: import.meta.env.VITE_NEAR_NODE_URL,
    });

    this.wallet = new WalletConnection(this.near, null);
  }

  viewFunction = async <T>(props: NearViewOptions): Promise<T> =>
    this.near.connection.provider
      .query({
        account_id: props.contractId,
        args_base64: Buffer.from(JSON.stringify(props.args)).toString("base64"),
        finality: "final",
        method_name: props.methodName,
        request_type: "call_function",
      })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .then(({ result }: CodeResult) =>
        JSON.parse(Buffer.from(result).toString())
      );

  callFunction = async (props: NearCallOptions) => {
    // Get executor account
    const executorAccount = await this.near.account(this.wallet.getAccountId());

    return executorAccount.functionCall({
      contractId: props.contractId,
      methodName: props.methodName,
      args: Buffer.from(JSON.stringify(props.args)),
      gas: props.gas.toString(),
      attachedDeposit: props.deposit.toString(),
    });
  };

  async createTransaction(
    receiverId: string,
    actions: Action[],
    nonceOffset = 1
  ) {
    const account = this.wallet.account();
    const connection = this.wallet.account().connection;

    const localKey = await connection.signer.getPublicKey(
      account.accountId,
      connection.networkId
    );

    const accessKey = await account.accessKeyForTransaction(
      receiverId,
      actions,
      localKey
    );

    if (!accessKey) {
      throw new Error(
        `Cannot find matching key for transaction sent to ${receiverId}`
      );
    }

    const block = await connection.provider.block({ finality: "final" });
    const blockHash = baseDecode(block.header.hash);

    const publicKey = PublicKey.from(accessKey.public_key);
    const nonce = accessKey.access_key.nonce + nonceOffset;

    return createTransaction(
      account.accountId,
      publicKey,
      receiverId,
      nonce,
      actions,
      blockHash
    );
  }

  async actionsToTransaction(receiverId: string, actions: NearAction[]) {
    return await this.createTransaction(
      receiverId,
      actions.map((action: NearAction) =>
        functionCall(
          action.methodName,
          action.args,
          action.gas.toFixed(),
          action.deposit.toFixed()
        )
      )
    );
  }

  executeMultipleTransactions(transactions: Transaction[], meta = "") {
    return this.wallet.requestSignTransactions({ transactions, meta });
  }
}

export const nearApi = new NearApi();
