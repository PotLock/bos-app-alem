import nearToUsd from "../modules/nearToUsd";
import formatWithCommas from "./formatWithCommas";

const nearToUsdWithFallback = (amountNear: number, abbreviate?: boolean) => {
  return nearToUsd
    ? "~$" + formatWithCommas((amountNear * nearToUsd).toFixed(2))
    : formatWithCommas(amountNear.toString()) + (abbreviate ? "N" : " NEAR");
};

export default nearToUsdWithFallback;
