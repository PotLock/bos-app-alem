import { Container, TableContainer } from "./styles";
import PotSDK from "@app/SDK/pot";
import constants from "@app/constants";
import { PotDetail } from "@app/types";
import { State, state, useParams } from "alem";
import SponsorsBoard from "../../components/SponsorsBoard/SponsorsBoard";
import SponsorsTable from "../../components/SponsorsTable/SponsorsTable";

const Sponsors = ({ potDetail }: { potDetail: PotDetail }) => {
  const { potId } = useParams();

  let sponsorshipDonations = PotSDK.getMatchingPoolDonations(potId);

  const { SUPPORTED_FTS } = constants;

  State.init({
    sponsorshipDonations: null,
  });

  if (sponsorshipDonations && !state.sponsorshipDonations) {
    // accumulate donations for each address
    sponsorshipDonations = sponsorshipDonations.reduce((accumulator: any, currentDonation: any) => {
      accumulator[currentDonation.donor_id] = {
        amount:
          parseFloat(accumulator[currentDonation.donor_id].amount || 0) +
          parseFloat(SUPPORTED_FTS.NEAR.fromIndivisible(currentDonation.net_amount)),
        ...currentDonation,
      };
      return accumulator;
    }, {});

    // add % share of total to each donation
    const total = parseFloat(SUPPORTED_FTS.NEAR.fromIndivisible(potDetail.matching_pool_balance));

    sponsorshipDonations = Object.values(sponsorshipDonations).sort((a: any, b: any) => b.amount - a.amount);
    sponsorshipDonations = sponsorshipDonations.map((donation: any) => {
      return {
        ...donation,
        percentage_share: ((donation.amount / total) * 100).toFixed(2).replace(/[.,]00$/, ""),
      };
    });
    State.update({ sponsorshipDonations });
  }

  if (!state.sponsorshipDonations) return <div className="spinner-border text-secondary" role="status" />;

  return (
    <Container>
      <SponsorsBoard donations={state.sponsorshipDonations.slice(0, 6)} />

      <TableContainer>
        <SponsorsTable sponsors={state.sponsorshipDonations} />
      </TableContainer>
    </Container>
  );
};

export default Sponsors;
