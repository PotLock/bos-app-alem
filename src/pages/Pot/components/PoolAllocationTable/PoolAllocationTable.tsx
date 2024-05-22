import { useState, useParams, Big, Social, useEffect, useMemo } from "alem";
import Image from "@app/components/mob.near/Image";
import constants from "@app/constants";
import { getConfig, getDonations, getFlaggedAccounts, getPayout, getSponsorships } from "@app/services/getPotData";
import { FlaggedAddress, Payout, PotDetail, PotDonation } from "@app/types";
import _address from "@app/utils/_address";
import formatWithCommas from "@app/utils/formatWithCommas";
import hrefWithParams from "@app/utils/hrefWithParams";
import nearToUsd from "@app/utils/nearToUsd";
import nearToUsdWithFallback from "@app/utils/nearToUsdWithFallback";
import yoctosToUsdWithFallback from "@app/utils/yoctosToUsdWithFallback";
import TableSkeleton from "./Table/TableSkeleton";
import { Container, Row } from "./Table/styles";

const PoolAllocationTable = () => {
  const { SUPPORTED_FTS } = constants;

  const { potId } = useParams();

  const [allPayouts, setAllPayouts] = useState<any>(null);
  const [sponsorshipDonations, setSponsorshipDonations] = useState<PotDonation[] | null>(null);
  const [usdToggle, setUsdToggle] = useState<any>(false);
  const [allDonations, setDonations] = useState<PotDonation[] | null>(null);
  const [flaggedAddresses, setFlaggedAddresses] = useState<FlaggedAddress[] | null>(null);
  const [potDetail, setPotDetail] = useState<PotDetail | null>(null);

  useEffect(() => {
    if (!sponsorshipDonations)
      getSponsorships({
        potId,
        updateState: setSponsorshipDonations,
      });
    if (!potDetail)
      getConfig({
        potId,
        updateState: setPotDetail,
      });
  }, []);

  useEffect(() => {
    if (potDetail) {
      if (!flaggedAddresses)
        getFlaggedAccounts({
          potId,
          potDetail,
          type: "list",
          updateState: setFlaggedAddresses,
        });
      if (!allDonations)
        getDonations({
          potId,
          potDetail,
          updateState: setDonations,
        });
    }
  }, [potDetail]);

  useEffect(() => {
    if (potDetail && flaggedAddresses && allDonations && !allPayouts) {
      getPayout({
        allDonations,
        flaggedAddresses,
        potDetail,
        potId,
        withTotalAmount: false,
        updateState: setAllPayouts,
      });
    }
  }, [potDetail, flaggedAddresses, allDonations]);

  if (potDetail === null) return <TableSkeleton />;

  const { total_public_donations, public_donations_count } = potDetail;

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

  const donorsCount = useMemo(() => {
    const uniqueDonorIds = allDonations ? new Set(allDonations.map((donation: any) => donation.donor_id)) : new Set([]);
    return uniqueDonorIds.size;
  }, [allDonations]);

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
        {donations.map(({ project_id, donor_id, matchingAmount, net_amount, amount }: any, idx: number) => {
          const id = donor_id || project_id;

          const generalAmount = net_amount || matchingAmount || amount;

          const nearAmount = formatWithCommas(SUPPORTED_FTS["NEAR"].fromIndivisible(generalAmount));

          const profile = Social.getr(`${id}/profile`);
          const matchedAmout = usdToggle ? yoctosToUsdWithFallback(generalAmount, true) : nearAmount;

          const url = project_id ? `?tab=project&projectId=${project_id}` : `?tab=profile&accountId=${donor_id}`;
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
        donations={allPayouts.slice(0, 5)}
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
