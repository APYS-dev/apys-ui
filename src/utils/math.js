import Big from 'big.js';

export function toPrecision(amount, decimals, necessaryDecimals) {
  if (decimals > necessaryDecimals) {
    return amount.div(Big(10).pow(decimals - necessaryDecimals));
  } else if (decimals < necessaryDecimals) {
    return amount.mul(Big(10).pow(necessaryDecimals - decimals));
  } else {
    return amount;
  }
}

export function fromPrecision(amount, decimals, necessaryDecimals) {
  if (decimals > necessaryDecimals) {
    return amount.mul(Big(10).pow(decimals - necessaryDecimals));
  } else if (decimals < necessaryDecimals) {
    return amount.div(Big(10).pow(necessaryDecimals - decimals));
  } else {
    return amount;
  }
}
