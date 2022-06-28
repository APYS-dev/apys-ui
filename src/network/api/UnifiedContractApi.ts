import { nearApi } from "@/network/api/NearApi";
import Big from "big.js";
import type { StorageBalanceResponse } from "@/network/models/UnifiedContractModels";
import type { StorageBalanceResponseDto } from "@/network/dtos/UnifiedContractDtos";

class UnifiedContractApi {
  constructor() {
    // TODO
  }

  getStorageBalanceOf = async (
    contractId: string,
    accountId: string
  ): Promise<StorageBalanceResponse> =>
    await nearApi
      .viewFunction<StorageBalanceResponseDto>({
        args: { account_id: accountId },
        methodName: "storage_balance_of",
        contractId: contractId,
      })
      .then((response) => ({
        total: Big(response.total),
        available: Big(response.available),
      }));
}

export const unifiedContractApi = new UnifiedContractApi();
