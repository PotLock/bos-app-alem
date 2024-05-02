import { Big, props, useContext, useMemo, useParams } from "alem";
import constants from "@app/constants";
import { Container } from "./styles";
import nearToUsdWithFallback from "@app/utils/nearToUsdWithFallback";
import Button from "@app/components/Button";
import FollowButton from "../FollowButton/FollowButton";
import { useDonationModal } from "@app/hooks/useDonationModal";

const DonationsInfo = ({ projectId, donations }: any) => {
  const { potId } = useParams();

  const { setDonationModalProps, successfulDonation, setSuccessfulDonation } = useDonationModal();

  // console.log("successfulDonation", successfulDonation);

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
        <Button
          type="primary"
          text="Donate"
          onClick={() =>
            // setSuccessfulDonation({
            //   "alem-lib.near": {
            //     id: 37,
            //     donor_id: "baam25.near",
            //     total_amount: "100000000000000000000000",
            //     net_amount: "91230000000000000000000",
            //     message: "",
            //     donated_at: 1714553743577,
            //     project_id: "alem-lib.near",
            //     referrer_id: null,
            //     referrer_fee: null,
            //     protocol_fee: "2000000000000000000000",
            //     matching_pool: false,
            //     chef_id: null,
            //     chef_fee: null,
            //   },
            // })
            setDonationModalProps({
              projectId,
              potId,
            })
          }
        />
        <FollowButton accountId={projectId} />
      </div>
    </Container>
  );
};

export default DonationsInfo;
