import { PotDetail } from "@app/types";

const filterBy = {
  "no-label": [
    {
      label: "Application open",
      val: "application_open",
    },
    {
      label: "Matching round open",
      val: "round_open",
    },
    {
      label: "Application closed",
      val: "application_closed",
    },
    {
      label: "Challenge period",
      val: "cooldown",
    },
  ],
};

const sortOptions = {
  "no-label": [
    {
      label: "Most to least in pot",
      val: "least_pots",
    },
    {
      label: "Least to most in pot",
      val: "most_pots",
    },
    {
      label: "Most to least donations",
      val: "most_donations",
    },
    {
      label: "Least to most donations",
      val: "least_donations",
    },
  ],
};

const currentDate = Date.now();

const filters: any = {
  application_not_started: (round: PotDetail) => currentDate < round.application_start_ms,
  application_open: (round: PotDetail) =>
    currentDate > round.application_start_ms && currentDate < round.application_end_ms,
  application_closed: (round: PotDetail) => currentDate > round.application_end_ms,
  round_end: (round: PotDetail) => currentDate > round.public_round_end_ms,
  round_open: (round: PotDetail) =>
    currentDate > round.public_round_start_ms && currentDate < round.public_round_end_ms,
  cooldown: (round: PotDetail) => currentDate > round.public_round_end_ms && currentDate < round.cooldown_end_ms,
  completed: (round: PotDetail) => round.all_paid_out,
};

const potsSort: any = {
  active: {
    check: filters.round_open,
    time: "public_round_end_ms",
    items: [],
  },
  cooldown: {
    check: filters.cooldown,
    time: "cooldown_end_ms",
    items: [],
  },
  application: {
    check: filters.application_open,
    time: "application_end_ms",
    items: [],
  },
  not_started: {
    check: filters.application_not_started,
    time: "application_start_ms",
    items: [],
  },
  rest: {
    check: (round: any) => true,
    time: "application_start_ms",
    items: [],
  },
};
export { filterBy, sortOptions, filters, potsSort };
