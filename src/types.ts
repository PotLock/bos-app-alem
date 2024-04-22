export type Project = {
  id: string;
  backgroundImage: string | { ipfs_cid: string };
  category: string;
  description: string;
  image: string | { ipfs_cid: string };
  status: string;
  submitted_ms: number;
  review_notes: string;
  registrant_id?: string;
  linktree: {
    github?: string;
    telegram?: string;
    twitter?: string;
    website?: string;
  };
  name: string;
  tags: Record<string, string>;
  team: Record<string, string>;
};
export type PotDetail = {
  owner: string;
  admins: string[];
  chef: string;
  pot_name: string;
  pot_description: string;
  max_projects: number;
  base_currency: string;
  application_start_ms: number;
  application_end_ms: number;
  public_round_start_ms: number;
  public_round_end_ms: number;
  deployed_by: string;
  registry_provider: string;
  min_matching_pool_donation_amount: string;
  sybil_wrapper_provider: string;
  custom_sybil_checks?: string;
  custom_min_threshold_score?: string;
  referral_fee_matching_pool_basis_points: number;
  referral_fee_public_round_basis_points: number;
  chef_fee_basis_points: number;
  matching_pool_balance: string;
  total_public_donations: string;
  public_donations_count: number;
  payouts: [];
  cooldown_end_ms?: number;
  all_paid_out: boolean;
  protocol_config_provider: number;
};

export type Pot = {
  id: string;
  deployed_by: string;
  deployed_at_ms: number;
};
