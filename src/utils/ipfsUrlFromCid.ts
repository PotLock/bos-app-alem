import constants from "@app/constants";

const ipfsUrlFromCid = (cid: string) => {
  const { IPFS_BASE_URL } = constants;
  return `${IPFS_BASE_URL}${cid}`;
};

export default ipfsUrlFromCid;
