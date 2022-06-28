import type Big from "big.js";

export function aprToApy(apr: Big, periodInDays: number): Big {
  return apr
    .div(100)
    .div(periodInDays)
    .plus(1)
    .pow(periodInDays)
    .minus(1)
    .mul(100);
}
