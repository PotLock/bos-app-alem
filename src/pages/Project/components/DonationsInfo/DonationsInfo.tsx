import { Big, useMemo, useState } from "alem";
import nearToUsd from "../../../../utils/nearToUsd";
import nearToUsdWithFallback from "../../../../utils/nearToUsdWithFallback";
import RegistrySDK from "../../../../SDK/registry";
import DonateSDK from "../../../../SDK/donate";
import { Container } from "./styles";
import Button from "../../../../components/Button";
import FollowButton from "../FollowButton/FollowButton";

type Props = {
  accountId: string;
  projectId: string;
};

const DonationsInfo = ({ accountId, projectId }: Props) => {
  const [isModalDonationOpen, setIsModalDonationOpen] = useState(false);
  const [successfulDonation, setSuccessfulDonation] = useState(false);

  const projectIsApproved = RegistrySDK.isProjectApproved(projectId);

  const donationsForProject = DonateSDK.getDonationsForRecipient(projectId);

  const [totalDonations, totalDonors, totalReferralFees] = useMemo(() => {
    if (!donationsForProject) {
      return ["", ""];
    }
    const donors: string[] = [];
    let totalDonationAmountNear = new Big(0);
    let totalReferralFees = new Big(0);
    for (const donation of donationsForProject) {
      if (!donors.includes(donation.donor_id)) {
        donors.push(donation.donor_id);
      }
      const totalAmount = new Big(donation.total_amount);
      const referralAmount = new Big(donation.referrer_fee || "0");
      const protocolAmount = new Big(donation.protocol_fee || "0");
      if (donation.ft_id === "near" || donation.base_currency === "near") {
        totalDonationAmountNear = totalDonationAmountNear.plus(totalAmount.minus(referralAmount).minus(protocolAmount));
      }
      totalReferralFees = totalReferralFees.plus(referralAmount);
    }
    return [
      totalDonationAmountNear.div(1e24).toNumber().toFixed(2),
      donors.length,
      totalReferralFees.div(1e24).toNumber().toFixed(2),
    ];
  }, [donationsForProject]);

  return (
    <Container>
      <div className="donations-info">
        <div className="amount">{nearToUsdWithFallback(Number(totalDonations))}</div>
        <div className="donors">
          Raised from <span> {totalDonors}</span> Donor{totalDonors === 1 ? "" : "s"}
        </div>
      </div>
      <div className="btn-wrapper">
        <Button type="primary" text="Donate" onClick={() => setIsModalDonationOpen(true)} />
        <FollowButton accountId={accountId} />
      </div>

      {/* <Widget
        src={`${ownerId}/widget/Project.ModalDonation`}
        props={{
          ...props,
          isModalOpen: isModalDonationOpen,
          onClose: () => setIsModalDonationOpen(false),
          recipientId: props.projectId,
          referrerId: props.referrerId,
          openDonateToProjectModal: () => setIsModalDonationOpen(true),
          openDonationModalSuccess: (donation) => {
            setIsModalDonationOpen(false);
            State.update({
              successfulDonation: donation,
            });
          },
          // potId: state.donateToProjectModal.potId, // TODO: add this in if project is in a pot?
        }}
      /> */}
      {/* {successfulDonation && (
        <Widget
          src={`${ownerId}/widget/Project.ModalSuccess`}
          props={{
            ...props,
            successfulDonation: state.successfulDonation,
            isModalOpen: state.successfulDonation != null,
            onClose: () =>
              State.update({
                successfulDonation: null,
              }),
          }}
        />
      )} */}
    </Container>
  );
};

export default DonationsInfo;
