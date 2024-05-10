import { Big, useMemo, useParams } from "alem";
import Button from "@app/components/Button";
import constants from "@app/constants";
import { useDonationModal } from "@app/hooks/useDonationModal";
import useModals from "@app/hooks/useModals";
import nearToUsdWithFallback from "@app/utils/nearToUsdWithFallback";
import FollowButton from "../FollowButton/FollowButton";
import { Container } from "./styles";

const DonationsInfo = ({ projectId, donations }: any) => {
  const { potId } = useParams();

  // Start Modals provider
  const Modals = useModals();
  // Use specific modal context
  const { setDonationModalProps } = useDonationModal();

  // Get total donations & Unique donors count
  const [totalDonationAmountNear, uniqueDonors] = useMemo(() => {
    let totalNear = Big(0);
    const uniqueDonors = [...new Set(donations.map((donation: any) => donation.donor_id))];
    donations.forEach((donation: any) => {
      if (donation.ft_id === "near" || donation.base_currency === "near") {
        totalNear = totalNear.plus(Big(donation.total_amount || donation.amount));
      }
    });
    const totalDonationAmountNear = constants.SUPPORTED_FTS["NEAR"].fromIndivisible(totalNear.toString());

    return [totalDonationAmountNear, uniqueDonors?.length];
  }, [donations]);

  return (
    <Container>
      <Modals />
      <div className="donations-info">
        <div className="amount">{nearToUsdWithFallback(Number(totalDonationAmountNear))}</div>
        <div className="donors">
          Raised from <span> {uniqueDonors}</span> {uniqueDonors === 1 ? "donor" : "donors"}
        </div>
      </div>
      <div className="btn-wrapper">
        <Button
          onClick={() =>
            setDonationModalProps({
              projectId,
              potId,
            })
          }
        >
          Donate
        </Button>
        <FollowButton accountId={projectId} />
      </div>
    </Container>
  );
};

export default DonationsInfo;
