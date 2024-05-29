import { asyncFetch, useCache } from "alem";

const nearToUsd = useCache(
  () =>
    asyncFetch("https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd").then((res) => {
      if (res.ok) {
        return res.body.near.usd;
      }
    }),
  "nearToUsd",
);

export default nearToUsd;
