import { Big, useMemo } from "alem";
import constants from "@app/constants";
import ExternalFunding from "../../components/ExternalFunding/ExternalFunding";
import PotlockFunding from "../../components/PotlockFunding/PotlockFunding";
import { Container, Line, NoResults } from "./styles";

const FundingRaised = (componentProps: any) => {
  const { donations, potPayouts, profile } = componentProps;
  const externalFunding = profile.plFundingSources ? JSON.parse(profile.plFundingSources) : [];

  // Get total donations & Unique donors count
  const [totalDonationAmountNear, uniqueDonors, totalMatched] = useMemo(() => {
    if (donations) {
      let totalNear = Big(0);
      const uniqueDonors = [...new Set(donations.map((donation: any) => donation.donor_id))];
      donations.forEach((donation: any) => {
        if (donation.ft_id === "near" || donation.base_currency === "near") {
          totalNear = totalNear.plus(Big(donation.total_amount || donation.amount));
        }
      });
      const totalDonationAmountNear = constants.SUPPORTED_FTS["NEAR"].fromIndivisible(totalNear.toString());
      let totalMatched: any = Big(0);

      if (potPayouts) {
        potPayouts.forEach((payout: any) => {
          totalMatched = totalMatched.plus(Big(payout.amount));
        });
      }

      totalMatched = constants.SUPPORTED_FTS["NEAR"].fromIndivisible(totalMatched.toString());
      return [totalDonationAmountNear, uniqueDonors?.length, totalMatched];
    }

    return ["", 0, 0];
  }, [donations, potPayouts]);

  return externalFunding.length === 0 && donations.length === 0 ? (
    <NoResults>
      <img src="https://ipfs.near.social/ipfs/bafkreif5awokaip363zk6zqrsgmpehs6rap3w67engc4lxdlk4x6iystru" alt="pots" />
      <div className="text">No funds have been raised for this project.</div>
    </NoResults>
  ) : (
    <Container>
      {externalFunding.length > 0 && <ExternalFunding externalFunding={externalFunding} />}
      {externalFunding.length > 0 && donations.length > 0 && <Line />}

      {donations.length > 0 && <PotlockFunding {...{ totalDonationAmountNear, uniqueDonors, totalMatched }} />}
    </Container>
  );
};

export default FundingRaised;
