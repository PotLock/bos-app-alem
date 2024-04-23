import { Container, NoResult, TrRow } from "./styles";
import nearToUsd from "@app/utils/nearToUsd";
import hrefWithParams from "@app/utils/hrefWithParams";

type Props = { sponsors: any; sortedDonations: any; filter: string; currentTab: string };

import { useEffect, useParams, useState } from "alem";
import ProfileImage from "@app/components/mob.near/ProfileImage";
import _address from "@app/utils/_address";
import Pagination from "@app/components/Pagination/Pagination";

const DonorsLeaderboard = (props: Props) => {
  const { sponsors, sortedDonations, filter, currentTab } = props;

  const { tab } = useParams();

  const donations = currentTab === "sponsors" ? sponsors : sortedDonations;
  const isInPot = tab === "pot";

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 30; // need to be less than 50

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const nearLogo = "https://ipfs.near.social/ipfs/bafkreicdcpxua47eddhzjplmrs23mdjt63czowfsa2jnw4krkt532pa2ha";

  return donations.length ? (
    <Container>
      <div className="transcation">
        <div className="header">
          <div className="rank">Rank</div>
          <div className="address">Donor</div>
          <div>Amount</div>
          {isInPot && <div>Percentage</div>}
          {nearToUsd && !isInPot && <div>Amount (USD)</div>}
        </div>
        {donations.slice((currentPage - 1) * perPage, currentPage * perPage).map((donation: any, idx: any) => {
          const { donor_id, amount, percentage_share } = donation;

          return (
            <TrRow>
              <div className="rank">#{idx + 1 + (currentPage - 1) * perPage}</div>

              <a href={hrefWithParams(`?tab=profile&accountId=${donor_id}`)} className="address" target="_blank">
                <ProfileImage style={{}} className="profile-image" accountId={donor_id} />

                {_address(donor_id, 15)}
              </a>

              <div className="price">
                <img src={nearLogo} alt="NEAR" />
                {amount.toFixed(2).replace(/[.,]00$/, "")}
              </div>
              {isInPot && <div>{percentage_share}%</div>}
              {nearToUsd && !isInPot && <div>~${(amount * nearToUsd).toFixed(2)}</div>}
            </TrRow>
          );
        })}
      </div>
      <Pagination
        {...{
          onPageChange: (page) => {
            setCurrentPage(page);
          },
          data: donations,
          currentPage,
          perPage: perPage,
          bgColor: "#292929",
        }}
      />
    </Container>
  ) : (
    <NoResult>No Donations</NoResult>
  );
};

export default DonorsLeaderboard;
