import { useState, useParams, Big, Social } from "alem";
import PotSDK from "@app/SDK/pot";
import Image from "@app/components/mob.near/Image";
import constants from "@app/constants";
import { PotDetail, PotDonation } from "@app/types";
import _address from "@app/utils/_address";
import calculatePayouts from "@app/utils/calculatePayouts";
import formatWithCommas from "@app/utils/formatWithCommas";
import hrefWithParams from "@app/utils/hrefWithParams";
import nearToUsd from "@app/utils/nearToUsd";
import nearToUsdWithFallback from "@app/utils/nearToUsdWithFallback";
import yoctosToUsdWithFallback from "@app/utils/yoctosToUsdWithFallback";
import TableSkeleton from "./Table/TableSkeleton";
import { Container, Row } from "./Table/styles";

type Props = {
  potDetail: PotDetail;
  allDonations: any;
};

const PoolAllocationTable = ({ potDetail, allDonations }: Props) => {
  const { SUPPORTED_FTS } = constants;

  const { total_public_donations, matching_pool_balance, public_donations_count } = potDetail;

  const [projectsId, setProjectsId] = useState<any>(null);
  const [allPayouts, setAllPayouts] = useState<any>(null);
  const [flaggedAddresses, setFlaggedAddresses] = useState(null);
  const [sponsorshipDonations, setSponsorshipDonations] = useState<PotDonation[] | null>(null);
  const [usdToggle, setUsdToggle] = useState<any>(false);

  const { potId } = useParams();

  if (!projectsId) {
    PotSDK.asyncGetApprovedApplications(potId).then((projects: any) => {
      setProjectsId(projects);
    });
  }

  if (potDetail && public_donations_count === 0) {
    PotSDK.asyncGetMatchingPoolDonations(potId).then((sponsorshipDonations: PotDonation[]) => {
      sponsorshipDonations.sort((a: any, b: any) => b.net_amount - a.net_amount);
      setSponsorshipDonations(sponsorshipDonations);
    });
  }

  const calcMatchedAmount = (donations: any) => {
    if (donations) {
      let total = Big(0);
      donations?.forEach((donation: any) => {
        total = total.plus(Big(donation.net_amount));
      });
      const amount = SUPPORTED_FTS["NEAR"].fromIndivisible(total.toString());
      return amount;
    }
  };

  const uniqueDonorIds = allDonations ? new Set(allDonations.map((donation: any) => donation.donor_id)) : new Set([]);

  const donorsCount = uniqueDonorIds.size;

  if (!flaggedAddresses && allDonations) {
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

  const sortAndSetPayouts = (payouts: any) => {
    payouts.sort((a: any, b: any) => {
      // sort by matching pool allocation, highest to lowest
      return b.matchingAmount - a.matchingAmount;
    });
    setAllPayouts(payouts.slice(0, 5));
  };

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
      sortAndSetPayouts(allPayouts);
    } else {
      calculatePayouts(allDonations, matching_pool_balance, flaggedAddresses).then((calculatedPayouts: any) => {
        allPayouts = Object.entries(calculatedPayouts).map(([projectId, { matchingAmount }]: any) => {
          return {
            projectId,
            matchingAmount,
          };
        });
        sortAndSetPayouts(allPayouts);
      });
    }
  }

  const Table = ({ donations, totalAmount, totalUniqueDonors, title }: any) => {
    return (
      <Container>
        <div className="header">
          {totalAmount}
          <span>raised from</span>
          {totalUniqueDonors}
          <span>{title === "sponsors" ? "sponsors" : "donors"}</span>
        </div>
        <div className="sort">
          <div className="title">Top {title} </div>
          <div
            className="sort-btn"
            style={{
              cursor: nearToUsd ? "pointer" : "default",
            }}
            onClick={() => (nearToUsd ? setUsdToggle(!usdToggle) : "")}
          >
            {nearToUsd && (
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 10.7575V5.5H7.5V10.7575H5.25L8.25 13.75L11.25 10.7575H9ZM3.75 0.25L0.75 3.2425H3V8.5H4.5V3.2425H6.75L3.75 0.25ZM9 10.7575V5.5H7.5V10.7575H5.25L8.25 13.75L11.25 10.7575H9ZM3.75 0.25L0.75 3.2425H3V8.5H4.5V3.2425H6.75L3.75 0.25Z"
                  fill="#7B7B7B"
                />
              </svg>
            )}
            {usdToggle ? "USD" : "NEAR"}
          </div>
        </div>
        {donations.map(({ projectId, donor_id, matchingAmount, net_amount }: any, idx: number) => {
          const id = donor_id || projectId;
          const nearAmount = formatWithCommas(SUPPORTED_FTS["NEAR"].fromIndivisible(net_amount || matchingAmount));

          const profile = Social.getr(`${id}/profile`);
          const matchedAmout = usdToggle ? yoctosToUsdWithFallback(matchingAmount || net_amount, true) : nearAmount;

          const url = projectId ? `?tab=project&projectId=${projectId}` : `?tab=profile&accountId=${donor_id}`;
          return (
            <Row>
              <div>#{idx + 1}</div>
              <a className="address" href={hrefWithParams(url)} target="_blank">
                <Image
                  image={profile?.image}
                  className="profile-image"
                  fallbackUrl="https://ipfs.near.social/ipfs/bafkreiccpup6f2kihv7bhlkfi4omttbjpawnsns667gti7jbhqvdnj4vsm"
                  style={{}}
                />
                {_address(profile?.name || id, 15)}
              </a>
              <div>
                {matchedAmout} {usdToggle ? " " : "N"}
              </div>
            </Row>
          );
        })}
      </Container>
    );
  };

  return public_donations_count > 0 ? (
    allPayouts !== null ? (
      <Table
        title="matching pool allocations"
        totalAmount={yoctosToUsdWithFallback(total_public_donations, true)}
        totalUniqueDonors={donorsCount}
        donations={allPayouts}
      />
    ) : (
      <TableSkeleton />
    )
  ) : sponsorshipDonations === null ? (
    <TableSkeleton />
  ) : sponsorshipDonations?.length > 0 ? (
    <Table
      title="sponsors"
      totalAmount={nearToUsdWithFallback(parseFloat(calcMatchedAmount(sponsorshipDonations) || "0"))}
      totalUniqueDonors={new Set(sponsorshipDonations.map((obj: any) => obj.donor_id)).size}
      donations={sponsorshipDonations.slice(0, 5)}
    />
  ) : (
    ""
  );
};

export default PoolAllocationTable;
