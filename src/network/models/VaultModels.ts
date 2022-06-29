import type Big from "big.js";

export interface AccountTotalBalance {
  withdraw: { [tokenId: string]: Big };
  deposit: { [tokenId: string]: Big };
  shares: Big;
  staked_shares: Big;
  reward_shares: Big;
}

type DepositProgressTaskType =
  | "ExchangeDeposit"
  | "HalfSwap"
  | "AddLiquidity"
  | "Stake";

type WithdrawProgressTaskType =
  | "RemoveLiquidity"
  | "Swap"
  | "ExchangeWithdraw"
  | "ContractWithdraw";

export interface ProgressTask {
  type: DepositProgressTaskType | WithdrawProgressTaskType;
  ready: boolean;
}

export interface AccountProgress {
  deposit_tasks: ProgressTask[];
  withdraw_tasks: ProgressTask[];
  other_tasks: ProgressTask[];
}
