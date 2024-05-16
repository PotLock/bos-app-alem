import { Social } from "alem";
import ProfileImage from "@app/components/mob.near/ProfileImage";
import constants from "@app/constants";
import _address from "@app/utils/_address";
import hrefWithParams from "@app/utils/hrefWithParams";
import { Container } from "./styles";

const Sponsor = ({ donation: { amount, donor_id, percentage_share }, colIdx }: any) => {
  const profile: any = Social.getr(`${donor_id}/profile`);
  const {
    SUPPORTED_FTS: { NEAR },
  } = constants;

  return (
    <div className={`item ${colIdx === 2 && "first"}`}>
      <ProfileImage style={{}} profile={profile} accountId={donor_id} />
      <a href={hrefWithParams(`?tab=profile&accountId=${donor_id}`)} target="_blank" className="name">
        {_address(profile.name || donor_id, 15)}
      </a>
      <div>{_address(profile.description, colIdx === 2 ? 120 : 35)}</div>
      <div className="footer">
        <div className="amount">{NEAR.fromIndivisible(amount)} NEAR</div>
        <div className="percentage">{percentage_share}%</div>
      </div>
    </div>
  );
};

const SponsorsBoard = (props: { donations: any }) => {
  const { donations } = props;

  const sponsorsLeaderboard = [donations.slice(1, 3), donations.slice(0, 1), donations.slice(3, 5)].filter(
    (subList) => subList.length > 0,
  );

  return (
    <Container>
      {sponsorsLeaderboard.map((donationsCol, colIdx) => (
        <div className="col">
          {donationsCol.map((donation: any, idx: number) => (
            <Sponsor donation={donation} colIdx={colIdx + 1} idx={idx + 1} />
          ))}
        </div>
      ))}
    </Container>
  );
};

export default SponsorsBoard;
