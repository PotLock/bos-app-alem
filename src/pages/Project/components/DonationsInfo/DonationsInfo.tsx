import { Big, props, useMemo, useState } from "alem";
import constants from "@app/constants";
import { Container } from "./styles";
import nearToUsdWithFallback from "@app/utils/nearToUsdWithFallback";
import Button from "@app/components/Button";
import FollowButton from "../FollowButton/FollowButton";
import ModalDonation from "@app/modals/ModalDonation";
import ModalSuccess from "@app/modals/ModalSuccess/ModalSuccess";

const DonationsInfo = ({ projectId, donations, referrerId }: any) => {
  const [isModalDonationOpen, setIsModalDonationOpen] = useState(false);
  const [successfulDonation, setSuccessfulDonation] = useState(null);

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
      <div className="donations-info">
        <div className="amount">{nearToUsdWithFallback(Number(totalDonationAmountNear))}</div>
        <div className="donors">
          Raised from <span> {uniqueDonors}</span> {uniqueDonors === 1 ? "donor" : "donors"}
        </div>
      </div>
      <div className="btn-wrapper">
        <Button type="primary" text="Donate" onClick={() => setIsModalDonationOpen(true)} />
        <FollowButton accountId={projectId} />
      </div>
      {isModalDonationOpen && (
        <ModalDonation
          {...{
            ...props,
            isModalOpen: isModalDonationOpen,
            onClose: () => setIsModalDonationOpen(false),
            projectId,
            referrerId,
            openDonationModalSuccess: (donation: any) => {
              setIsModalDonationOpen(false);
              setSuccessfulDonation(donation);
            },
          }}
        />
      )}
      {successfulDonation && (
        <ModalSuccess
          {...{
            ...props,
            successfulDonation: successfulDonation,
            isModalOpen: successfulDonation != null,
            onClose: () => setSuccessfulDonation(null),
          }}
        />
      )}
    </Container>
  );
};

export default DonationsInfo;
