import type Big from "big.js";

export function aprToApy(apr: Big, periodInDays: number): number {
  return (
    (Math.pow(apr.toNumber() / 100 / periodInDays + 1, periodInDays) - 1) * 100
  );
}

export function receivedAmountForApy(
  amount: Big,
  apr: Big,
  periodInDays: number
): number {
  return amount
    .mul(Math.pow(apr.toNumber() / 100 + 1, periodInDays / 365) - 1)
    .toNumber();
}
