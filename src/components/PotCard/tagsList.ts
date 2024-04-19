import { PotDetail } from "@app/types";
import daysUntil from "@app/utils/daysUntil";

const tagsList = (potConfig: PotDetail) => {
  const {
    application_start_ms,
    application_end_ms,
    public_round_start_ms,
    public_round_end_ms,
    cooldown_end_ms,
    all_paid_out,
  } = potConfig;

  const now = Date.now();
  const applicationOpen = now >= application_start_ms && now < application_end_ms;
  const publicRoundOpen = now >= public_round_start_ms && now < public_round_end_ms;
  const cooldownPending = public_round_end_ms && now >= public_round_end_ms && !cooldown_end_ms;
  const cooldownOpen = now >= public_round_end_ms && now < cooldown_end_ms;
  const payoutsPending = cooldown_end_ms && now >= cooldown_end_ms && !all_paid_out;
  const payoutsCompleted = all_paid_out;

  const tags = [
    /* Application's has not started tag */
    {
      backgroundColor: "#EFFEFA",
      borderColor: "#33DDCB",
      textColor: "#023131",
      text: "Sponsorship Open",
      textStyle: { fontWeight: 500, marginLeft: "8px" },
      preElementsProps: {
        colorOuter: "#CAFDF3",
        colorInner: "#33DDCB",
        animate: true,
      },
      visibility: now < application_start_ms,
    },
    /* Application tag */
    {
      backgroundColor: "#EFFEFA",
      borderColor: "#33DDCB",
      textColor: "#023131",
      text: daysUntil(application_end_ms) + " left to apply",
      textStyle: { fontWeight: 500, marginLeft: "8px" },
      preElementsProps: {
        colorOuter: "#CAFDF3",
        colorInner: "#33DDCB",
        animate: true,
      },
      visibility: applicationOpen,
    },
    /* Matching round open tag */
    {
      backgroundColor: "#F7FDE8",
      borderColor: "#9ADD33",
      textColor: "#192C07",
      text: daysUntil(public_round_end_ms) + " left to donate",
      textStyle: { fontWeight: 500, marginLeft: "8px" },
      preElementsProps: {
        colorOuter: "#D7F5A1",
        colorInner: "#9ADD33",
        animate: true,
      },
      visibility: publicRoundOpen,
    },
    /* Cooldown pending tag */
    {
      backgroundColor: "#F5F3FF",
      borderColor: "#A68AFB",
      textColor: "#2E0F66",
      text: "Cooldown pending",
      textStyle: { fontWeight: 500, marginLeft: "8px" },
      preElementsProps: {
        colorOuter: "#EDE9FE",
        colorInner: "#A68AFB",
        animate: true,
      },
      visibility: cooldownPending,
    },
    /* Matching round cooldown tag */
    {
      backgroundColor: "#F5F3FF",
      borderColor: "#A68AFB",
      textColor: "#2E0F66",
      text: "Challenge period",
      textStyle: { fontWeight: 500, marginLeft: "8px" },
      preElementsProps: {
        colorOuter: "#EDE9FE",
        colorInner: "#A68AFB",
        animate: true,
      },
      visibility: cooldownOpen,
    },
    /* Payouts pending tag */
    {
      backgroundColor: "#F7FDE8",
      borderColor: "#9ADD33",
      textColor: "#192C07",
      text: "Payouts pending",
      preElementsProps: {
        colorOuter: "#D7F5A1",
        colorInner: "#9ADD33",
        animate: true,
      },
      textStyle: { fontWeight: 500, marginLeft: "8px" },
      visibility: payoutsPending,
    },
    /* Matching round closed tag */
    {
      backgroundColor: "#464646",
      borderColor: "#292929",
      textColor: "#FFF",
      text: "Payouts completed",
      preElementsProps: {
        colorOuter: "#656565",
        colorInner: "#A6A6A6",
        animate: false,
      },
      textStyle: { fontWeight: 500, marginLeft: "8px" },
      visibility: payoutsCompleted,
    },
  ];

  return tags;
};

export default tagsList;
