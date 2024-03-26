import { IPFS_BASE_URL } from "../constants";

const ipfsUrlFromCid = (cid: string) => {
  return `${IPFS_BASE_URL}${cid}`;
};

export default ipfsUrlFromCid;
