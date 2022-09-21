import { nearApi } from "@/network/api/NearApi";
import { CLAIM_BONUS_REWARDS_GAS, DEFAULT_GAS } from "@/utils/constants";
import type { NearAction } from "@/network/api/NearApi";
import Big from "big.js";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import { useAuthStore } from "@/stores/auth";
import { unifiedContractApi } from "@/network/api/UnifiedContractApi";
import { useGeneralStore } from "@/stores/general";

class BonusRewardsApi {
  constructor(private bonusRewardsContractId: string) {}

  claimBonusRewards = async (strategyId: string): Promise<void> => {
    const transactions = [];
    const { accountId } = useAuthStore();
    const { metadata } = useGeneralStore();

    const needStorageDeposit = await this.checkNeedStorageDeposit(
      metadata.bonusRewardsTokenId,
      accountId
    );
    if (needStorageDeposit) {
      const action: NearAction = {
        args: {},
        gas: DEFAULT_GAS,
        methodName: "storage_deposit",
        deposit: Big(parseNearAmount("0.00125") || "0"),
      };
      const transaction = await nearApi.actionsToTransaction(
        metadata.bonusRewardsTokenId,
        [action]
      );
      transactions.push(transaction);
    }

    // Create transfer transaction
    const transferAction: NearAction = {
      args: {
        strategy_id: strategyId,
      },
      gas: CLAIM_BONUS_REWARDS_GAS,
      deposit: Big(0),
      methodName: "claim_rewards",
    };
    const transferTransaction = await nearApi.actionsToTransaction(
      this.bonusRewardsContractId,
      [transferAction]
    );
    transactions.push(transferTransaction);

    // Execute transactions
    return await nearApi.executeMultipleTransactions(transactions);
  };

  getUnclaimedReward = async (
    strategyId: string,
    accountId: string
  ): Promise<string> => {
    return Promise.resolve("0");

    // nearApi.viewFunction({
    //   args: {
    //     strategy_id: strategyId,
    //     account_id: accountId,
    //   },
    //   methodName: "get_unclaimed_reward",
    //   contractId: this.bonusRewardsContractId,
    // });
  };

  checkNeedStorageDeposit = async (
    bonusRewardTokenId: string,
    accountId: string
  ): Promise<boolean> => {
    const storageBalance = await unifiedContractApi.getStorageBalanceOf(
      bonusRewardTokenId,
      accountId
    );

    return storageBalance.total.eq(new Big(0));
  };
}

export const bonusRewardsApi = new BonusRewardsApi(
  import.meta.env.VITE_BONUS_REWARDS_CONTRACT_ID
);
