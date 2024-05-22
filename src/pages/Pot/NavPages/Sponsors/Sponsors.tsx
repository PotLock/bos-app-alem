import { useEffect, useParams, useState } from "alem";
import { getConfig, getSponsorships } from "@app/services/getPotData";
import { PotDetail, PotDonation } from "@app/types";
import SponsorsBoard from "../../components/SponsorsBoard/SponsorsBoard";
import SponsorsTable from "../../components/SponsorsTable/SponsorsTable";
import { Container, TableContainer } from "./styles";

const Sponsors = () => {
  const { potId } = useParams();

  const [sponsorshipDonations, setSponsorshipDonations] = useState<null | PotDonation[]>(null);
  const [potDetail, setPotDetail] = useState<null | PotDetail>(null);

  useEffect(() => {
    if (!potDetail) {
      getConfig({
        potId,
        updateState: setPotDetail,
      });
    }
    if (!sponsorshipDonations && potDetail) {
      getSponsorships({
        potId,
        updateState: (donations) => {
          let sponsorshipDonations = donations.reduce((accumulator: any, currentDonation: any) => {
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
          setSponsorshipDonations(sponsorshipDonations);
        },
      });
    }
  }, [potDetail]);

  if (!sponsorshipDonations) return <div className="spinner-border text-secondary" role="status" />;

  return (
    <Container>
      <SponsorsBoard donations={sponsorshipDonations.slice(0, 6)} />

      <TableContainer>
        <SponsorsTable sponsors={sponsorshipDonations} />
      </TableContainer>
    </Container>
  );
};

export default Sponsors;
