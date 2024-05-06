import { asyncFetch } from "alem";

const uploadFileUpdateState = (body: any, callback: any) => {
  asyncFetch("https://ipfs.near.social/add", {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
  }).then(callback);
};

export default uploadFileUpdateState;
