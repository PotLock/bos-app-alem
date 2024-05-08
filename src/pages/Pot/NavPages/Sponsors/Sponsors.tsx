import { State, state, useParams } from "alem";
import PotSDK from "@app/SDK/pot";
import { PotDetail } from "@app/types";
import SponsorsBoard from "../../components/SponsorsBoard/SponsorsBoard";
import SponsorsTable from "../../components/SponsorsTable/SponsorsTable";
import { Container, TableContainer } from "./styles";

const Sponsors = ({ potDetail }: { potDetail: PotDetail }) => {
  const { potId } = useParams();

  let sponsorshipDonations = PotSDK.getMatchingPoolDonations(potId);

  State.init({
    sponsorshipDonations: null,
  });

  if (sponsorshipDonations && !state.sponsorshipDonations) {
    // accumulate donations for each address
    sponsorshipDonations = sponsorshipDonations.reduce((accumulator: any, currentDonation: any) => {
      accumulator[currentDonation.donor_id] = {
        amount: accumulator[currentDonation.donor_id].amount || 0 + currentDonation.net_amount,
        ...currentDonation,
      };
      return accumulator;
    }, {});

    // add % share of total to each donation
    const total = parseFloat(potDetail.matching_pool_balance);

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
