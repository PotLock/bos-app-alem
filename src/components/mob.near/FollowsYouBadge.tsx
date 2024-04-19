/**
 * https://near.org/near/widget/ComponentDetailsPage?src=mob.near/widget/FollowsYouBadge
 */

import { Social, context } from "alem";

const FollowsYouBadge = (props: any) => {
  if (!props.accountId || !context.accountId) {
    return "";
  }

  const o = Social.keys(`${props.accountId}/graph/follow/${context.accountId}`, undefined, {
    values_only: true,
  });

  return o && Object.keys(o).length ? <span className="badge bg-secondary fw-light">Follows you</span> : "";
};

export default FollowsYouBadge;
