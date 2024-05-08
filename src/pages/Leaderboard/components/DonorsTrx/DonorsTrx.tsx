import { Big, Near, useEffect, useState } from "alem";
import Pagination from "@app/components/Pagination/Pagination";
import ProfileImage from "@app/components/mob.near/ProfileImage";
import _address from "@app/utils/_address";
import getTimePassed from "@app/utils/getTimePassed";
import hrefWithParams from "@app/utils/hrefWithParams";
import { Container, NoResult, TrRow } from "./styles";

const DonorsTrx = (props: { allDonations: any; filter: string }) => {
  const { allDonations: donations, filter } = props;

  const allDonations = [...donations].reverse();

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 30; // need to be less than 50

  const nearLogo = "https://ipfs.near.social/ipfs/bafkreicdcpxua47eddhzjplmrs23mdjt63czowfsa2jnw4krkt532pa2ha";

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const NEAR_DECEMIALS = 24;

  const calcNetDonationAmount = (amount: any, decimals: any) => Big(amount).div(Big(`1e${decimals}`));

  return allDonations.length ? (
    <Container>
      <div className="transcation">
        <div className="header">
          <div className="address">Donor</div>
          <div className="address">Project</div>
          <div>Amount</div>
          <div>Date</div>
        </div>
        {allDonations.slice((currentPage - 1) * perPage, currentPage * perPage).map((donation) => {
          const { donor_id, recipient_id, donated_at_ms, donated_at, project_id, ft_id, total_amount } = donation;
          const projectId = recipient_id || project_id;
          const isNear = ft_id === "near";

          const frMetaDate: any = !isNear ? Near.view(ft_id, "ft_metadata", {}) : null;
          const assetIcon = isNear ? nearLogo : frMetaDate.icon;

          const decimals = isNear ? NEAR_DECEMIALS : frMetaDate.decimals;

          return (
            <TrRow>
              <a href={hrefWithParams(`?tab=profile&accountId=${donor_id}`)} className="address" target="_blank">
                <ProfileImage style={{}} accountId={donor_id} />
                {_address(donor_id)}
              </a>

              <a href={hrefWithParams(`?tab=project&projectId=${projectId}`)} className="address" target="_blank">
                <ProfileImage style={{}} accountId={projectId} />

                {_address(projectId)}
              </a>

              <div className="price">
                <img src={assetIcon} alt={ft_id} />

                {decimals ? calcNetDonationAmount(total_amount, decimals).toFixed(2) : "-"}
              </div>

              <div>{getTimePassed(donated_at_ms || donated_at)} ago</div>
            </TrRow>
          );
        })}
      </div>
      <Pagination
        {...{
          onPageChange: (page) => {
            setCurrentPage(page);
          },
          data: allDonations,
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

export default DonorsTrx;
