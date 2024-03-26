import { Big, asyncFetch, useCache } from "alem";
import formatWithCommas from "./formatWithCommas";

const nearToUsd = useCache(
  () =>
    asyncFetch("https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd").then((res) => {
      if (res.ok) {
        return res.body.near.usd;
      }
    }),
  "nearToUsd",
);

const yoctosToUsd = (amount: number) => {
  return nearToUsd ? "~$" + formatWithCommas(new Big(amount).mul(nearToUsd).div(1e24).toFixed(2)) : "0";
};

export default yoctosToUsd;
