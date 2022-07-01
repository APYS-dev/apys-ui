import { defineStore } from "pinia";
import type { Vault } from "@/stores/types";
import type {
  TokenMetaWithPrice,
  VaultMeta,
} from "@/network/models/InfoServerModels";
import { useAuthStore } from "@/stores/auth";
import { vaultApi } from "@/network/api/VaultApi";
import { apysApi } from "@/network/api/ApysApi";
import Big from "big.js";
import type { AccountProgress } from "@/network/models/VaultModels";

interface State {
  vaults: Vault[];
}

export const useVaultStore = defineStore({
  id: "vault",
  state: (): State => ({
    vaults: [],
  }),
  getters: {
    getVaultById: (state: State) => (vaultId: string) => {
      return state.vaults.find((it) => it.meta.contractId === vaultId);
    },
    checkProgressLoadedForVault: (state: State) => (vaultId: string) => {
      return (
        state.vaults.find((it) => it.meta.contractId === vaultId)
          ?.progressLoaded ?? false
      );
    },
    checkVaultProcessing: (state: State) => (vaultId: string) => {
      const progress = state.vaults.find((it) => it.meta.contractId === vaultId)
        ?.progress ?? {
        deposit_tasks: [],
        withdraw_tasks: [],
        other_tasks: [],
      };
      return checkVaultProcessing(progress);
    },
  },
  actions: {
    initVaultsByVaultsMeta(vaults: VaultMeta[]) {
      this.vaults = vaults.map((token) => ({
        meta: token,
        progress: {
          deposit_tasks: [],
          withdraw_tasks: [],
          other_tasks: [],
        },
        contractMeta: {
          last_reward_time: Big(0),
          staked_shares_count: Big(0),
        },
        balanceInDollars: Big(0),
        rewardInDollars: Big(0),
        isProcessing: false,
        balancesLoaded: false,
        progressLoaded: false,
        contractMetaLoaded: true,
      }));
    },

    async fetchVaultContractMeta(vaultId: string): Promise<void> {
      const metadata = await vaultApi.getMetadata(vaultId);

      // Update state
      const vaultIndex = this.vaults.findIndex(
        (it) => it.meta.contractId === vaultId
      );
      if (vaultIndex !== -1) {
        this.vaults[vaultIndex] = {
          ...this.vaults[vaultIndex],
          contractMeta: metadata,
          contractMetaLoaded: true,
        };
      } else {
        throw new Error(`Vault ${vaultId} not found`);
      }
    },

    async fetchVaultBalance(vaultId: string): Promise<void> {
      // Get stores
      const { accountId } = useAuthStore();

      // Get current vault meta
      const vault = this.getVaultById(vaultId);
      if (!vault) {
        throw new Error(`Vault ${vaultId} not found`);
      }

      // Fetch total vault account balances
      const totalVaultBalance = await vaultApi.getTotalAccountBalance(
        accountId,
        vaultId
      );

      // Calculate total balances cost (deposit, withdraw and shares)
      const totalBalanceCost = calculateTokenBalancesCost(
        totalVaultBalance.deposit,
        totalVaultBalance.withdraw,
        vault.meta.depositTokens
        // Calculate and add shares cost
      ).plus(
        totalVaultBalance.shares
          .plus(totalVaultBalance.staked_shares)
          .div(Big(10).pow(18))
          .mul(vault.meta.osc)
      );

      // Calculate reward shares cost
      const rewardSharesCost = totalVaultBalance.reward_shares
        .div(Big(10).pow(18))
        .mul(vault.meta.osc);

      // Update state
      const vaultIndex = this.vaults.findIndex(
        (it) => it.meta.contractId === vaultId
      );
      if (vaultIndex !== -1) {
        this.vaults[vaultIndex] = {
          ...this.vaults[vaultIndex],
          balanceInDollars: totalBalanceCost,
          rewardInDollars: rewardSharesCost,
          balancesLoaded: true,
        };
      } else {
        throw new Error(`Vault ${vaultId} not found`);
      }
    },

    async fetchVaultProgress(vaultId: string): Promise<void> {
      // Get stores
      const { accountId } = useAuthStore();

      // Fetch vault progress
      const progress = await vaultApi.getAccountProgress(accountId, vaultId);

      // Check if vault is processing
      const isProcessing = checkVaultProcessing(progress);

      // Update state
      const vaultIndex = this.vaults.findIndex(
        (it) => it.meta.contractId === vaultId
      );
      if (vaultIndex !== -1) {
        this.vaults[vaultIndex] = {
          ...this.vaults[vaultIndex],
          isProcessing,
          progress,
        };
      } else {
        throw new Error(`Vault ${vaultId} not found`);
      }
    },

    async deposit(vaultId: string, tokenId: string, amount: string) {
      return apysApi.depositToStrategy(vaultId, tokenId, amount);
    },

    async withdraw(vaultId: string, tokenId: string) {
      return vaultApi.withdraw(vaultId, tokenId);
    },
  },
});

const calculateTokenBalancesCost = (
  vaultDeposit: { [tokenId: string]: Big },
  vaultWithdraw: { [tokenId: string]: Big },
  tokenMetas: TokenMetaWithPrice[]
): Big => {
  const totalBalances: { [tokenId: string]: Big } = {};

  // Add vault deposit balances
  for (const [tokenId, balance] of Object.entries(vaultDeposit)) {
    totalBalances[tokenId] = (totalBalances[tokenId] ?? Big(0)).plus(balance);
  }

  // Add vault withdraw balances
  for (const [tokenId, balance] of Object.entries(vaultWithdraw)) {
    totalBalances[tokenId] = (totalBalances[tokenId] ?? Big(0)).plus(balance);
  }

  // Calculate and merge token balances
  return Object.entries(totalBalances)
    .map(([tokenId, balance]) => {
      // Get token meta
      const tokenMeta = tokenMetas.find((it) => it.contractId === tokenId);
      if (!tokenMeta) {
        throw new Error(`Price not found for token ${tokenId}`);
      }

      // Calculate token balance cost
      return balance
        .div(new Big(10).pow(tokenMeta.decimals))
        .mul(tokenMeta.price);
    })
    .reduce((acc, curr) => acc.plus(curr), new Big(0));
};

const checkVaultProcessing = (progress: AccountProgress) => {
  // Check deposit tasks
  for (const task of progress.deposit_tasks) {
    if (!task.ready) {
      return true;
    }
  }

  // Check withdraw tasks
  for (const task of progress.withdraw_tasks) {
    if (!task.ready) {
      return true;
    }
  }

  // Check other tasks
  for (const task of progress.other_tasks) {
    if (!task.ready) {
      return true;
    }
  }

  return false;
};
