import { nearApi } from "@/network/api/NearApi";
import type { NearAction } from "@/network/api/NearApi";
import Big from "big.js";
import type {
  AccountTotalBalanceDto,
  VaultContractMetadataDto,
} from "@/network/dtos/VaultDtos";
import type {
  AccountProgress,
  AccountTotalBalance,
  VaultContractMetadata,
} from "@/network/models/VaultModels";
import {
  DEFAULT_GAS,
  ONE_YOCTO_NEAR,
  STOP_STRATEGY_GAS,
} from "@/utils/constants";

class VaultApi {
  constructor() {
    // TODO
  }

  getMetadata = async (vaultId: string): Promise<VaultContractMetadata> =>
    await nearApi
      .viewFunction<VaultContractMetadataDto>({
        args: {},
        methodName: "get_metadata",
        contractId: vaultId,
      })
      .then((response) => ({
        last_reward_time: new Big(response.last_reward_time),
        staked_shares_count: new Big(response.staked_shares_count),
      }));

  getAccountProgress = async (
    accountId: string,
    vaultId: string
  ): Promise<AccountProgress> =>
    await nearApi.viewFunction({
      args: { account_id: accountId },
      methodName: "get_account_progress",
      contractId: vaultId,
    });

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

  deposit = async (
    vaultId: string,
    tokenId: string,
    amount: string
  ): Promise<void> => {
    const transactions = [];

    // Create transfer transaction
    const transferAction: NearAction = {
      args: {
        receiver_id: vaultId,
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
