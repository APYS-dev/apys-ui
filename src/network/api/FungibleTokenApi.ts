import { nearApi } from "@/network/api/NearApi";
import Big from "big.js";

class FungibleTokenApi {
  constructor() {
    // TODO
  }

  getBalanceOf = async (accountId: string, tokenId: string): Promise<Big> =>
    await nearApi
      .viewFunction<string>({
        args: { account_id: accountId },
        methodName: "ft_balance_of",
        contractId: tokenId,
      })
      .then((response) => new Big(response));
}

export const fungibleTokenApi = new FungibleTokenApi();
