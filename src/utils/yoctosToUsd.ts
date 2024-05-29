import { Big, asyncFetch, useCache } from "alem";
import formatWithCommas from "./formatWithCommas";

const nearUsd = useCache(
  () =>
    asyncFetch("https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd").then((res) => {
      if (res.ok) {
        return res.body.near.usd;
      }
    }),
  "nearToUsd",
);

const yoctosToUsd = (amount: number | string) => {
  return nearUsd ? "~$" + formatWithCommas(new Big(amount).mul(nearUsd).div(1e24).toFixed(2)) : "0";
};

export default yoctosToUsd;
