export interface AccountTotalBalanceDto {
  withdraw: { [tokenId: string]: string };
  deposit: { [tokenId: string]: string };
  shares: string;
  staked_shares: string;
  reward_shares: string;
}
