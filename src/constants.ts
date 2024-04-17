// import { Big, props } from "alem";

import { Big, props } from "alem";
import styled from "styled-components";

// // TODO: Usar Context?
// export const donationContractId = "donate.potlock.near";
// export const nadabotContractId = props.env === "staging" ? "v1.staging.nadabot.near" : "v1.nadabot.near";

// export const IPFS_BASE_URL = "https://ipfs.near.social/ipfs/";
// export const HERO_BACKGROUND_IMAGE_URL = IPFS_BASE_URL + "bafkreiewg5afxbkvo6jbn6jgv7zm4mtoys22jut65fldqtt7wagar4wbga";

// export const ownerId = "potlock.near";

// export const DONATION_CONTRACT_ID = "donate.potlock.near";

// export const SUPPORTED_FTS = {
//   NEAR: {
//     iconUrl: "https://nftstorage.link/ipfs/bafkreidnqlap4cp5o334lzbhgbabwr6yzkj6albia62l6ipjsasokjm6mi",
//     toIndivisible: (amount: any) => new Big(amount).mul(new Big(10).pow(24)),
//     fromIndivisible: (amount: any, decimals: any) =>
//       Big(amount)
//         .div(Big(10).pow(24))
//         .toFixed(decimals || 2),
//   },
//   USD: {
//     iconUrl: "$",
//     toIndivisible: (amount: any) => new Big(amount).mul(new Big(10).pow(24)),
//     fromIndivisible: (amount: any, decimals: any) =>
//       Big(amount)
//         .div(Big(10).pow(24))
//         .toFixed(decimals || 2),
//   },
// };

// export const PROJECT_STATUSES = ["Pending", "Approved", "Rejected", "Graylisted", "Blacklisted"];

const constants = {
  nadabotContractId: props.env === "staging" ? "v1.staging.nadabot.near" : "v1.nadabot.near",
  ownerId: "potlock.near",
  PROJECT_STATUSES: ["Pending", "Approved", "Rejected", "Graylisted", "Blacklisted"],
  DONATION_CONTRACT_ID: "donate.potlock.near",
  NADABOT_HUMAN_METHOD: "is_human",
  IPFS_BASE_URL: "https://ipfs.near.social/ipfs/",
  ONE_TGAS: Big(1_000_000_000_000),
  MAX_DONATION_MESSAGE_LENGTH: 100,
  NADA_BOT_URL: "https://app.nada.bot",
  SUPPORTED_FTS: {
    NEAR: {
      iconUrl: "https://nftstorage.link/ipfs/bafkreidnqlap4cp5o334lzbhgbabwr6yzkj6albia62l6ipjsasokjm6mi",
      toIndivisible: (amount: any) => new Big(amount).mul(new Big(10).pow(24)),
      fromIndivisible: (amount: any, decimals: any) =>
        Big(amount)
          .div(Big(10).pow(24))
          .toFixed(decimals || 2),
    },
    USD: {
      iconUrl: "$",
      toIndivisible: (amount: any) => new Big(amount).mul(new Big(10).pow(24)),
      fromIndivisible: (amount: any, decimals: any) =>
        Big(amount)
          .div(Big(10).pow(24))
          .toFixed(decimals || 2),
    },
  },
  ToDo: styled.div`
    position: relative;

    &::before {
      content: "TODO: ";
      position: absolute;
      left: 0;
      top: 0;
      transform: translate(-110%, 0);
      background-color: yellow;
    }
  `,
};

export default constants;
