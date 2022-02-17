import { ethers } from 'ethers';

export default {
  install: (app) => {
    app.config.globalProperties.$formatAmount = function (value, skipCurrencySign = false, defaultValue = 'n/a') {
      if (typeof value == 'undefined' || value === null || isNaN(value)) {
        return defaultValue;
      }

      const currencyFormat = new Intl.NumberFormat('en-US', {
        useGrouping: true,
        maximumFractionDigits: 0,
        notation: 'compact',
      });

      const formattedValue = currencyFormat.format(value);

      return (skipCurrencySign ? '' : '$') + formattedValue;
    };

    app.config.globalProperties.$formatPrice = function (value, skipCurrencySign = false, defaultValue = 'n/a') {
      if (typeof value == 'undefined' || value === null || isNaN(value)) {
        return defaultValue;
      }

      const currencyFormat = new Intl.NumberFormat('en-US', {
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
        notation: 'standard',
      });

      const formattedValue = currencyFormat.format(value);

      return (skipCurrencySign ? '' : '$') + formattedValue;
    };

    app.config.globalProperties.$formatUnits = (value, decimals = 18, withFixedPart = false, defaultValue = 'n/a') => {
      if ((value ?? null) === null) {
        return defaultValue;
      }

      const formattedValue = ethers.utils.formatUnits(value, decimals);

      if (withFixedPart) {
        return ethers.utils.commify(parseFloat(formattedValue).toFixed(2));
      }

      return ethers.utils.commify(parseFloat(formattedValue).toFixed(0));
    };

    app.config.globalProperties.$formatUnitsToken = (
      value,
      decimals = 18,
      countOfSymbols = 6,
      defaultValue = 'n/a'
    ) => {
      if ((value ?? null) === null) {
        return defaultValue;
      }

      const formattedValue = ethers.utils.formatUnits(value.toString(), decimals);

      return ethers.utils.commify(parseFloat(formattedValue).toFixed(countOfSymbols));
    };

    app.config.globalProperties.$formatPercent = (percent, defaultValue = 'n/a') => {
      if (percent === null || percent === undefined || isNaN(percent)) {
        return defaultValue;
      }

      const percentString = parseFloat(percent * 100).toFixed(3);

      return percentString + '%';
    };

    app.config.globalProperties.$formatIntegerPercent = (percent, defaultValue = 'n/a') => {
      if (percent === null || percent === undefined || isNaN(percent) || percent === '') {
        return defaultValue;
      }

      const percentString = parseInt(percent);

      return percentString + '%';
    };
  },
};
