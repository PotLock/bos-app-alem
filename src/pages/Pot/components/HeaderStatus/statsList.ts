import { PotDetail } from "@app/types";

const statsList = (potDetail: PotDetail) => {
  const {
    application_start_ms,
    application_end_ms,
    public_round_start_ms,
    public_round_end_ms,
    cooldown_end_ms,
    all_paid_out,
  } = potDetail;

  const now = Date.now();

  const stats = [
    {
      label: "Applications round",
      daysLeft: application_end_ms,
      started: now >= application_start_ms,
      completed: now > application_end_ms,
      progress:
        now > application_end_ms ? 1 : (now - application_start_ms) / (application_end_ms - application_start_ms),
    },
    {
      label: "Matching round",
      daysLeft: public_round_end_ms,
      started: now >= public_round_start_ms,
      completed: now > public_round_end_ms,
      progress:
        now > public_round_end_ms ? 1 : (now - public_round_start_ms) / (public_round_end_ms - public_round_start_ms),
    },
    {
      label: "Challenge period",
      daysLeft: cooldown_end_ms,
      started: now >= public_round_end_ms,
      completed: now > cooldown_end_ms && !!cooldown_end_ms,
      progress:
        now > cooldown_end_ms && !!cooldown_end_ms
          ? 1
          : (cooldown_end_ms - now) / (public_round_end_ms - cooldown_end_ms),
    },
    {
      label: "Payouts completed",
      daysLeft: null,
      started: null,
      completed: all_paid_out,
      progress: all_paid_out ? 1 : 0,
    },
  ];

  return stats;
};

export default statsList;
