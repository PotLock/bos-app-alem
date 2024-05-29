import { asyncFetch } from "alem";

export default function getTransactionsFromHashes(transactionHashes: string, accountId: string) {
  const transactionHashesList = transactionHashes.split(",");

  const transactions = transactionHashesList.map((transaction) => {
    const body = JSON.stringify({
      jsonrpc: "2.0",
      id: "dontcare",
      method: "tx",
      params: [transaction, accountId],
    });

    // archival RPC node
    // https://archival-rpc.mainnet.near.org
    return asyncFetch("https://near.lava.build", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
  });

  return Promise.all(transactions);
}
