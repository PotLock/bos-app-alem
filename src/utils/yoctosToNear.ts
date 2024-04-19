import { Big } from "alem";
import formatWithCommas from "./formatWithCommas";

const yoctosToNear = (amountYoctos: string, abbreviate?: boolean) => {
  return formatWithCommas(new Big(amountYoctos).div(1e24).toFixed(2)) + (abbreviate ? "N" : " NEAR");
};

export default yoctosToNear;
