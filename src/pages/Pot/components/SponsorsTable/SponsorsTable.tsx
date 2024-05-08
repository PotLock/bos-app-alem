import { OverlayTrigger, useEffect, useState, Tooltip, useParams } from "alem";
import Pagination from "@app/components/Pagination/Pagination";
import ProfileImage from "@app/components/mob.near/ProfileImage";
import _address from "@app/utils/_address";
import hrefWithParams from "@app/utils/hrefWithParams";
import nearToUsd from "@app/utils/nearToUsd";
import { Container, NoResult, Percentage, TrRow } from "./styles";

const SponsorsTable = ({ sponsors }: { sponsors: any }) => {
  const { tab } = useParams();

  const isInPot = tab === "pot";

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 30; // need to be less than 50

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  let totalDonations = 0;
  sponsors.forEach((donation: any) => {
    totalDonations += donation.amount;
  });

  return sponsors.length ? (
    <Container>
      <div className="transcation">
        <div className="header">
          <div className="rank">Rank</div>
          <div className="address">Donor</div>
          <div>Amount</div>
          {nearToUsd && !isInPot && <div>Amount (USD)</div>}
        </div>
        {sponsors.slice((currentPage - 1) * perPage, currentPage * perPage).map((donation: any, idx: number) => {
          const { donor_id, amount, percentage_share } = donation;

          return (
            <TrRow>
              <div className="rank">#{idx + 1 + (currentPage - 1) * perPage}</div>

              <a href={hrefWithParams(`?tab=profile&accountId=${donor_id}`)} className="address" target="_blank">
                <ProfileImage style={{}} accountId={donor_id} />

                <OverlayTrigger placement="top" overlay={<Tooltip>{donor_id}</Tooltip>}>
                  <div> {_address(donor_id, 15)}</div>
                </OverlayTrigger>
              </a>
              <div className="sponsors-amount">
                {amount.toFixed(2).replace(/[.,]00$/, "")}N{" "}
                <Percentage>{percentage_share === "0" ? "<0.01" : percentage_share}%</Percentage>{" "}
              </div>
            </TrRow>
          );
        })}
      </div>
      <Pagination
        {...{
          onPageChange: (page) => {
            setCurrentPage(page);
          },
          data: sponsors,
          currentPage,
          perPage: perPage,
        }}
      />
    </Container>
  ) : (
    <NoResult>No Sponsors</NoResult>
  );
};

export default SponsorsTable;
