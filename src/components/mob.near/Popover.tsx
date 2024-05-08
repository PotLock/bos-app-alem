/**
 * https://near.org/near/widget/ComponentDetailsPage?src=mob.near/widget/Profile.Popover
 */
import { Markdown, Social } from "alem";
import styled from "styled-components";
import FollowButton from "./FollowButton";
import FollowStats from "./FollowStats";
import FollowsYouBadge from "./FollowsYouBadge";
import InlineBlock from "./InlineBlock";
import PokeButton from "./PokeButton";

const Popover = (props: any) => {
  const accountId = props.accountId;
  if (!accountId) {
    return "Requires accountID prop";
  }

  const description = Social.get<string>(`${accountId}/profile/description`);

  const Description = styled.div`
    max-height: 8rem;
    position: relative;
    overflow: hidden;
    h1,
    .h1,
    h2,
    .h2,
    h3,
    .h3,
    h4,
    .h4,
    h5,
    .h5,
    h6,
    .h6 {
      font-size: 1.2rem;
      margin: 0;
    }
    p {
      margin: 0;
    }
    :after {
      content: "";
      position: absolute;
      z-index: 1;
      top: 4rem;
      left: 0;
      pointer-events: none;
      background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 90%);
      width: 100%;
      height: 4rem;
    }
  `;

  return (
    <div className="d-flex flex-column gap-1">
      <a href={`#/mob.near/widget/ProfilePage?accountId=${accountId}`} className="link-dark text-truncate">
        <InlineBlock {...{ accountId, hideDescription: true }} />
      </a>
      <Description>
        <Markdown text={description} />
      </Description>
      <div className="d-flex">
        <div className="me-3">
          <FollowStats accountId={accountId} />
        </div>
        <FollowsYouBadge accountId={accountId} />
      </div>
      <div className="d-flex gap-2">
        <FollowButton accountId={accountId} />
        <PokeButton accountId={accountId} />
      </div>
    </div>
  );
};

export default Popover;
