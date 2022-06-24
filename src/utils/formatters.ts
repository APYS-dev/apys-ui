import Big from "big.js";

export function formatPrice(
  price?: number,
  skipCurrencySign = false,
  defaultValue = "n/a"
): string {
  if (!price || price === 0) {
    return defaultValue;
  }

  const currencyFormat = new Intl.NumberFormat("en-US", {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    notation: "standard",
  });

  const formattedValue = currencyFormat.format(price);

  return (skipCurrencySign ? "" : "$") + formattedValue;
}

export function formatAmount(
  amount: Big,
  options: {
    decimals: number;
    fractionDigits: number;
  }
): string {
  return amount
    .div(new Big(10).pow(options.decimals))
    .toFixed(options.fractionDigits, 0); // 0 is RoundingMode.ROUND_DOWN
}
