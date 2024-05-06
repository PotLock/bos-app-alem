import PotFactorySDK from "@app/SDK/potfactory";
import constants from "@app/constants";
import { PotDetail } from "@app/types";
import formatTimestampForDateTimeLocal from "@app/utils/formatTimestampForDateTimeLocal";

const getFields = (potId: string, potDetail: PotDetail) => {
  const {
    owner,
    chef,
    admins,
    pot_name,
    pot_description,
    max_projects,
    application_start_ms,
    application_end_ms,
    public_round_start_ms,
    public_round_end_ms,
    sybil_wrapper_provider,
    referral_fee_matching_pool_basis_points,
    referral_fee_public_round_basis_points,
    chef_fee_basis_points,
    min_matching_pool_donation_amount,
    registry_provider,
  } = potDetail;

  const {
    SUPPORTED_FTS: { NEAR },
  } = constants;

  const potFactoryContractId = PotFactorySDK.getContractId();

  return [
    {
      label: "Name",
      val: pot_name,
    },
    {
      label: "Custom handle",
      val: potId.split(`.${potFactoryContractId}`)[0],
    },
    {
      label: "Description",
      val: pot_description,
    },
    {
      label: "Referrer fee % (matching pool)",
      val: referral_fee_matching_pool_basis_points / 100 + "%",
    },
    {
      label: "Referrer fee % (public round)",
      val: referral_fee_public_round_basis_points / 100 + "%",
    },
    {
      label: "Application date",
      val: `${formatTimestampForDateTimeLocal(application_start_ms)} - ${formatTimestampForDateTimeLocal(
        application_end_ms,
      )}`,
    },
    {
      label: "Matching round date",
      val: `${formatTimestampForDateTimeLocal(public_round_start_ms)} - ${formatTimestampForDateTimeLocal(
        public_round_end_ms,
      )}`,
    },
    {
      label: "Min matching pool donation",
      val: NEAR.fromIndivisible(min_matching_pool_donation_amount),
    },
    {
      label: "Chef fee",
      val: chef_fee_basis_points / 100 + "%",
    },
    {
      label: "Assigned Chef",
      val: chef,
    },
    {
      label: "Max. approved projects",
      val: max_projects,
    },
    {
      label: "Registry Provider",
      val: registry_provider,
    },
    {
      label: "Donor Sybil Resistance",
      val: sybil_wrapper_provider ? "🤖 nada.bot human verified" : "none",
    },
  ];
};

export default getFields;
