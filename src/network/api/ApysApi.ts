import { nearApi } from "@/network/api/NearApi";
import type { NearAction } from "@/network/api/NearApi";
import Big from "big.js";
import { unifiedContractApi } from "@/network/api/UnifiedContractApi";
import { useAuthStore } from "@/stores/auth";
import { DEFAULT_GAS, ONE_YOCTO_NEAR, WITHDRAW_GAS } from "@/utils/constants";

class ApysApi {
  constructor() {
    // TODO
  }

  getWhitelistedTokens = async (): Promise<string[]> =>
    await nearApi.viewFunction({
      args: {},
      methodName: "get_whitelisted_tokens",
      contractId: import.meta.env.VITE_APYS_CONTRACT_ID,
    });

  getAccountBalance = async (
    accountId: string,
    tokenId: string
  ): Promise<Big> =>
    await nearApi
      .viewFunction<string>({
        args: { account_id: accountId, token_id: tokenId },
        methodName: "get_account_balance",
        contractId: import.meta.env.VITE_APYS_CONTRACT_ID,
      })
      .then((response) => new Big(response));

  checkNeedStorageDeposit = async (accountId: string): Promise<boolean> => {
    const storageBalance = await unifiedContractApi.getStorageBalanceOf(
      import.meta.env.VITE_APYS_CONTRACT_ID,
      accountId
    );

    return (
      storageBalance.total.eq(new Big(0)) ||
      storageBalance.total.eq(new Big("14880000000000000000000")) // Temporary workaround
    );
  };

  deposit = async (tokenId: string, amount: string): Promise<void> => {
    const transactions = [];

    // Get stores
    const { accountId } = useAuthStore();

    // Check storage deposit and create transaction if necessary
    const needStorageDeposit = await apysApi.checkNeedStorageDeposit(accountId);
    if (needStorageDeposit) {
      const action: NearAction = {
        args: {},
        gas: DEFAULT_GAS,
        methodName: "storage_deposit",
        deposit: Big("0.1"),
      };
      const transaction = await nearApi.actionsToTransaction(
        import.meta.env.VITE_APYS_CONTRACT_ID,
        [action]
      );
      transactions.push(transaction);
    }

    // Create transfer transaction
    const transferAction: NearAction = {
      args: {
        receiver_id: import.meta.env.VITE_APYS_CONTRACT_ID,
        amount,
        msg: "",
      },
      gas: DEFAULT_GAS,
      deposit: ONE_YOCTO_NEAR,
      methodName: "ft_transfer_call",
    };
    const transferTransaction = await nearApi.actionsToTransaction(tokenId, [
      transferAction,
    ]);
    transactions.push(transferTransaction);

    // Execute transactions
    return await nearApi.executeMultipleTransactions(transactions);
  };

  withdraw = async (tokenId: string, amount: string): Promise<void> => {
    const transactions = [];

    // Get stores
    const { accountId } = useAuthStore();

    // Check storage deposit and create transaction if necessary
    const needStorageDeposit = await this.checkNeedStorageDeposit(accountId);
    if (needStorageDeposit) {
      const action: NearAction = {
        args: {},
        gas: DEFAULT_GAS,
        methodName: "storage_deposit",
        deposit: Big("0.00125"),
      };
      const transaction = await nearApi.actionsToTransaction(tokenId, [action]);
      transactions.push(transaction);
    }

    // Create transfer transaction
    const transferAction: NearAction = {
      args: {
        amount,
        token_id: tokenId,
      },
      gas: WITHDRAW_GAS,
      methodName: "withdraw",
      deposit: ONE_YOCTO_NEAR,
    };
    const transferTransaction = await nearApi.actionsToTransaction(
      import.meta.env.VITE_APYS_CONTRACT_ID,
      [transferAction]
    );
    transactions.push(transferTransaction);

    // Execute transactions
    return await nearApi.executeMultipleTransactions(transactions);
  };
}

export const apysApi = new ApysApi();
