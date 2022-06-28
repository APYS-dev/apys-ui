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
import type { AccountTotalBalance } from "@/network/models/VaultModels";

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
  },
  actions: {
    initVaultsByVaultsMeta(vaults: VaultMeta[]) {
      this.vaults = vaults.map((token) => ({
        meta: token,
        balanceInDollars: Big(0),
        rewardInDollars: Big(0),
        isProcessing: false,
        balancesLoaded: false,
      }));
    },

    async fetchVaultBalance(
      vaultId: string
    ): Promise<{ loaded: boolean; processing: boolean }> {
      // Get stores
      const { accountId } = useAuthStore();

      // Get current vault meta
      const vault = this.getVaultById(vaultId);
      if (!vault) {
        return { loaded: false, processing: false };
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

      // Check if vault is processing
      const isProcessing = checkVaultProcessing(totalVaultBalance);

      // Update state
      const vaultIndex = this.vaults.findIndex(
        (it) => it.meta.contractId === vaultId
      );
      if (vaultIndex !== -1) {
        this.vaults[vaultIndex] = {
          ...this.vaults[vaultIndex],
          balanceInDollars: totalBalanceCost,
          rewardInDollars: rewardSharesCost,
          isProcessing,
          balancesLoaded: true,
        };

        // Return true if balance fetched
        return { loaded: true, processing: isProcessing };
      }
      // Otherwise, return false
      return { loaded: false, processing: false };
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

const checkVaultProcessing = (totalVaultBalance: AccountTotalBalance) => {
  // Has vault deposit/withdraw balances
  const hasVaultDeposit = Object.values(totalVaultBalance.deposit).length > 0;
  const hasVaultDepositShares = totalVaultBalance.shares.gt(0);
  const hasVaultWithdraw = Object.values(totalVaultBalance.withdraw).length > 0;

  return hasVaultDeposit || hasVaultDepositShares || hasVaultWithdraw;
};
