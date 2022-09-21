import { nearApi } from "@/network/api/NearApi";
import type { NearAction } from "@/network/api/NearApi";
import type { AccountAutoFarmingDto } from "@/network/dtos/ApysDtos";
import type {
  AccountAutoFarming,
  AutoFarmingChanges,
} from "@/network/models/ApysModels";
import type { VaultMeta } from "@/network/models/InfoServerModels";
import Big from "big.js";
import { DEFAULT_GAS } from "@/utils/constants";
import { parseNearAmount } from "near-api-js/lib/utils/format";

class ApysApi {
  constructor() {
    // TODO
  }

  getAccountAutoFarmingConfig = async (
    accountId: string
  ): Promise<AccountAutoFarming> => {
    const response = await nearApi.viewFunction<AccountAutoFarmingDto>({
      args: { account_id: accountId },
      methodName: "get_account_auto_farming_config",
      contractId: import.meta.env.VITE_APYS_CONTRACT_ID,
    });

    // Convert balances
    const balances: Record<
      VaultMeta["category"],
      Record<string, Big>
    > = Object.create({});
    for (const [category, categoryBalances] of Object.entries(
      response.balances
    ) as [VaultMeta["category"], Record<string, string>][]) {
      balances[category] = {};
      for (const [vaultId, balance] of Object.entries(categoryBalances)) {
        balances[category][vaultId] = new Big(balance);
      }
    }

    return {
      enabled: response.enabled,
      active: response.active,
      balances,
      config: response.config,
    };
  };

  startAutoFarming = async (
    configs: Record<VaultMeta["category"], AutoFarmingChanges>
  ): Promise<void> => {
    const transactions = [];

    // Create transfer transaction
    const transferAction: NearAction = {
      args: {
        configs: configs,
      },
      gas: DEFAULT_GAS,
      deposit: Big(parseNearAmount("1") || "0"),
      methodName: "start_auto_farming",
    };
    const transferTransaction = await nearApi.actionsToTransaction(
      import.meta.env.VITE_APYS_CONTRACT_ID,
      [transferAction]
    );
    transactions.push(transferTransaction);

    // Execute transactions
    return await nearApi.executeMultipleTransactions(transactions);
  };

  updateAutoFarming = async (
    enabled: boolean,
    changes: Record<VaultMeta["category"], AutoFarmingChanges>
  ): Promise<void> => {
    const transactions = [];

    // Create transfer transaction
    const transferAction: NearAction = {
      args: {
        enabled,
        changes,
      },
      gas: DEFAULT_GAS,
      deposit: Big(0),
      methodName: "update_auto_farming",
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
