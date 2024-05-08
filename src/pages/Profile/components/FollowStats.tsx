import { Social, promisify } from "alem";
import styled from "styled-components";
import hrefWithParams from "../../../utils/hrefWithParams";

type Props = {
  projectId?: string;
  accountId: string;
};

const FollowStats = ({ projectId: _projectId, accountId: _accountId }: Props) => {
  const projectId = _projectId;
  const accountId = projectId || _accountId;

  if (!accountId) {
    return "";
  }

  const following = Social.keys<any>(`${accountId}/graph/follow/*`, "final", {
    return_type: "BlockHeight",
    values_only: true,
  });

  const followers = Social.keys(`*/graph/follow/${accountId}`, "final", {
    return_type: "BlockHeight",
    values_only: true,
  });

  const numFollowing = following ? Object.keys(following[accountId].graph.follow || {}).length : 0;
  const numFollowers = followers ? Object.keys(followers || {}).length : 0;

  const profileLink = hrefWithParams(
    `?tab=${projectId ? "project" : "profile"}&${projectId ? "projectId" : "accountId"}=${projectId || accountId}`,
  );

  const Container = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
    gap: 2rem;
    a {
      gap: 8px;
      display: flex;
    }
    @media screen and (max-width: 768px) {
      gap: 1rem;
    }
  `;

  return (
    <Container>
      <div>
        <a href={`${profileLink}&nav=followers`} className="text-dark">
          {numFollowers !== null ? <span style={{ fontWeight: 600 }}>{numFollowers}</span> : "-"}

          <span>Follower{numFollowers !== 1 && "s"}</span>
        </a>
      </div>
      <div>
        <a href={`${profileLink}&nav=following`} className="text-dark">
          {numFollowing !== null ? <span style={{ fontWeight: 600 }}>{numFollowing}</span> : "-"}

          <span>Following</span>
        </a>
      </div>
    </Container>
  );
};

export default FollowStats;
