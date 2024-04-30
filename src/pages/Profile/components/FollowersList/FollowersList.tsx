import { Social, props, useEffect, useMemo, useState } from "alem";
import { Container } from "./styles";
import Preview from "../Preview";
import FollowButton from "@app/components/mob.near/FollowButton";

type Props = { accountId: string; nav: any };

const FollowersList = ({ accountId, nav }: Props) => {
  const [followers, setFollowers] = useState<any>(null);

  if (!accountId) {
    return "";
  }

  const url = nav === "followers" ? `*/graph/follow/${accountId}` : `${accountId}/graph/follow/*`;

  let followersKeys: any = Social.keys<any>(url, "final", {
    return_type: "BlockHeight",
    values_only: true,
  });

  if (!followers && followersKeys) {
    let followers: any = [];
    if (nav === "followers") {
      followers = Object.entries(followersKeys || {});
      followers.sort((a: any, b: any) => b.graph.follow[accountId][1] - a.graph.follow[accountId][1]);
    } else {
      followers = Object.entries(followersKeys[accountId].graph.follow || {});
      followers.sort((a: any, b: any) => b[1] - a[1]);
    }

    setFollowers(followers);
  }

  return (
    <Container>
      {followers === null
        ? "Loading..."
        : followers
        ? followers.map(([accountId]: any, i: number) => (
            <div className="profile-row" key={i}>
              <div className="me-4">
                <Preview {...{ ...props, accountId }} />
              </div>
              <div>
                <FollowButton accountId={accountId} />
              </div>
            </div>
          ))
        : `No ${nav}`}
    </Container>
  );
};

export default FollowersList;
