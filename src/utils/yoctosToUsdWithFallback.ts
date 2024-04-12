import { Big } from "alem";
import formatWithCommas from "./formatWithCommas";
import nearToUsd from "./nearToUsd";

const yoctosToUsdWithFallback = (amountYoctos: string, abbreviate?: string) => {
  return nearToUsd
    ? "~$" + formatWithCommas(new Big(amountYoctos).mul(nearToUsd).div(1e24).toFixed(2))
    : formatWithCommas(new Big(amountYoctos).div(1e24).toFixed(2)) + (abbreviate ? "N" : " NEAR");
};

export default yoctosToUsdWithFallback;
