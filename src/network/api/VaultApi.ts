import { nearApi } from "@/network/api/NearApi";
import type { NearAction } from "@/network/api/NearApi";
import Big from "big.js";
import type { AccountTotalBalanceDto } from "@/network/dtos/VaultDtos";
import type { AccountTotalBalance } from "@/network/models/VaultModels";
import { ONE_YOCTO_NEAR, STOP_STRATEGY_GAS } from "@/utils/constants";

class VaultApi {
  constructor() {
    // TODO
  }

  getTotalAccountBalance = async (
    accountId: string,
    vaultId: string
  ): Promise<AccountTotalBalance> =>
    await nearApi
      .viewFunction<AccountTotalBalanceDto>({
        args: { account_id: accountId },
        methodName: "get_total_account_balances",
        contractId: vaultId,
      })
      .then((response) => this.mapAccountTotalBalance(response));

  withdraw = async (vaultId: string, tokenId: string): Promise<void> => {
    const transactions = [];

    // Create transfer transaction
    const transferAction: NearAction = {
      args: {
        token_id: tokenId,
      },
      gas: STOP_STRATEGY_GAS,
      deposit: ONE_YOCTO_NEAR,
      methodName: "stop",
    };
    const transferTransaction = await nearApi.actionsToTransaction(vaultId, [
      transferAction,
    ]);
    transactions.push(transferTransaction);

    // Execute transactions
    return await nearApi.executeMultipleTransactions(transactions);
  };

  private mapAccountTotalBalance(
    dto: AccountTotalBalanceDto
  ): AccountTotalBalance {
    const mapBalances = (balances: { [tokenId: string]: string }) => {
      const newBalances: { [tokenId: string]: Big } = {};
      for (const [tokenId, balance] of Object.entries(balances)) {
        newBalances[tokenId] = new Big(balance);
      }
      return newBalances;
    };

    return {
      deposit: mapBalances(dto.deposit),
      withdraw: mapBalances(dto.withdraw),
      shares: new Big(dto.shares),
      staked_shares: new Big(dto.staked_shares),
      reward_shares: new Big(dto.reward_shares),
    };
  }
}

export const vaultApi = new VaultApi();
