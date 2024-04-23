import { PotDetail } from "@app/types";
import constants from "@app/constants";
import _address from "@app/utils/_address";
import PotSDK from "@app/SDK/pot";
import { useState, useParams, Big } from "alem";
import Table from "./Table/Table";
import nearToUsdWithFallback from "@app/utils/nearToUsdWithFallback";
import yoctosToUsdWithFallback from "@app/utils/yoctosToUsdWithFallback";
import calculatePayouts from "@app/utils/calculatePayouts";

type Props = {
  potDetail: PotDetail;
  allDonations: any;
};

const PoolAllocationTable = ({ potDetail, allDonations }: Props) => {
  const { SUPPORTED_FTS, NADA_BOT_URL } = constants;

  const { base_currency, total_public_donations, matching_pool_balance, public_donations_count } = potDetail;

  const [projectsId, setProjectsId] = useState<any>(null);
  const [allPayouts, setAllPayouts] = useState<any>(null);
  const [flaggedAddresses, setFlaggedAddresses] = useState(null);

  const { potId } = useParams();

  if (!projectsId) {
    PotSDK.asyncGetApprovedApplications(potId).then((projects: any) => {
      setProjectsId(projects);
    });
  }

  let sponsorshipDonations = PotSDK.getMatchingPoolDonations(potId);
  if (sponsorshipDonations) sponsorshipDonations.sort((a: any, b: any) => b.net_amount - a.net_amount);

  const calcMatchedAmount = (donations: any) => {
    if (donations) {
      let total = Big(0);
      donations?.forEach((donation: any) => {
        total = total.plus(Big(donation.net_amount));
      });
      const amount = SUPPORTED_FTS[base_currency.toUpperCase() || "NEAR"].fromIndivisible(total.toString());
      return amount;
    }
  };

  const uniqueDonorIds = allDonations ? new Set(allDonations.map((donation: any) => donation.donor_id)) : new Set([]);

  const donorsCount = uniqueDonorIds.size;

  if (!flaggedAddresses) {
    PotSDK.getFlaggedAccounts(potDetail, potId)
      .then((data) => {
        if (data) {
          const listOfFlagged: any = [];
          data?.forEach((adminFlaggedAcc: any) => {
            const addresses = Object.keys(adminFlaggedAcc.potFlaggedAcc);
            listOfFlagged.push(...addresses);
          });
          setFlaggedAddresses(listOfFlagged);
        }
      })
      .catch((err) => console.log("error getting the flagged accounts ", err));
  }

  if (!allPayouts && allDonations?.length > 0 && flaggedAddresses) {
    let allPayouts = [];

    if (potDetail.payouts.length) {
      allPayouts = potDetail.payouts.map((payout) => {
        const { project_id, amount } = payout;
        return {
          projectId: project_id,
          matchingAmount: amount,
        };
      });
    } else {
      const calculatedPayouts = calculatePayouts(allDonations, matching_pool_balance, flaggedAddresses);

      // calculate estimated payouts
      allPayouts = Object.entries(calculatedPayouts).map(([projectId, { matchingAmount }]: any) => {
        return {
          projectId,
          matchingAmount,
        };
      });
    }
    allPayouts.sort((a, b) => {
      // sort by matching pool allocation, highest to lowest
      return b.matchingAmount - a.matchingAmount;
    });
    setAllPayouts(allPayouts.slice(0, 5));
  }

  return allPayouts?.length > 0 ? (
    <Table
      title="matching pool allocations"
      totalAmount={yoctosToUsdWithFallback(total_public_donations, true)}
      totalUniqueDonors={donorsCount}
      donations={allPayouts}
    />
  ) : sponsorshipDonations.length > 0 ? (
    <Table
      title="sponsors"
      totalAmount={nearToUsdWithFallback(calcMatchedAmount(sponsorshipDonations))}
      totalUniqueDonors={new Set(sponsorshipDonations.map((obj: any) => obj.donor_id)).size}
      donations={sponsorshipDonations.slice(0, 5)}
    />
  ) : (
    ""
  );
};

export default PoolAllocationTable;
