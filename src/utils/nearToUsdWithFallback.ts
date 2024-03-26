import formatWithCommas from "./formatWithCommas";
import nearToUsd from "./nearToUsd";

const nearToUsdWithFallback = (amountNear: number, abbreviate?: boolean) => {
  return nearToUsd
    ? "~$" + formatWithCommas((amountNear * nearToUsd).toFixed(2))
    : formatWithCommas(amountNear.toString()) + (abbreviate ? "N" : " NEAR");
};

export default nearToUsdWithFallback;
