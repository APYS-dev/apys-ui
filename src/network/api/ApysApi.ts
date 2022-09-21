import { nearApi } from "@/network/api/NearApi";
import type { AccountAutoFarmingDto } from "@/network/dtos/ApysDtos";
import type { AccountAutoFarming } from "@/network/models/ApysModels";
import type { VaultMeta } from "@/network/models/InfoServerModels";
import Big from "big.js";

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
}

export const apysApi = new ApysApi();
