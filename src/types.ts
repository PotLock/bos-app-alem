export type Project = {
  id: string;
  backgroundImage: string | { ipfs_cid: string };
  category: string;
  description: string;
  image: string | { ipfs_cid: string };
  status: string;
  submitted_ms: number;
  review_notes: string;
  registrant_id: string;
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
  base_currency: "near";
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
  cooldown_end_ms: number | null;
  all_paid_out: boolean;
  protocol_config_provider: string;
};

export type Pot = {
  id: string;
  deployed_by: string;
  deployed_at_ms: number;
};

export type PotDonation = {
  id: string;
  donor_id: string;
  total_amount: string;
  net_amount: string;
  message: string;
  donated_at: number;
  project_id: null | "string";
  referrer_id: null | "string";
  referrer_fee: null | "string";
  protocol_fee: string;
  matching_pool: boolean;
  chef_id: null | "string";
  chef_fee: null | "string";
};

export type FundDonation = {
  id: string;
  donor_id: string;
  total_amount: string;
  net_amount: string;
  message: string;
  donated_at: number;
  project_id: null;
  referrer_id: null | "string";
  referrer_fee: null | "string";
  protocol_fee: string;
  matching_pool: true;
  chef_id: null | "string";
  chef_fee: null | "string";
};

export type RegistrationStatus = "Approved" | "Rejected" | "Pending" | "Graylisted" | "Blacklisted";

export type Registration = {
  id: string;
  registrant_id: string;
  list_id: number;
  status: RegistrationStatus;
  submitted_ms: number;
  updated_ms: number;
  admin_notes: null | string;
  registrant_notes: null | string;
  registered_by: string;
};
