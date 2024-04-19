import { Big } from "alem";

const calcNetDonationAmount = (donation: any) => {
  const lastDonationAmount = Big(
    donation.total_amount - (donation.referrer_fee || 0) - (donation.protocol_fee || 0),
  ).div(Big(1e24));
  return parseFloat(lastDonationAmount as any);
};

export default calcNetDonationAmount;
