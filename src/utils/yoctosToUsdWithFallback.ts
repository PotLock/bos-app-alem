import { Big } from "alem";
import nearToUsd from "../modules/nearToUsd";
import formatWithCommas from "./formatWithCommas";

const yoctosToUsdWithFallback = (amountYoctos: string, abbreviate?: boolean) => {
  return nearToUsd
    ? "~$" + formatWithCommas(new Big(amountYoctos).mul(nearToUsd).div(1e24).toFixed(2))
    : formatWithCommas(new Big(amountYoctos).div(1e24).toFixed(2)) + (abbreviate ? "N" : " NEAR");
};

export default yoctosToUsdWithFallback;
