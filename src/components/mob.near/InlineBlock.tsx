/**
 * https://near.org/near/widget/ComponentDetailsPage?src=mob.near/widget/Profile.InlineBlock
 */

import { Social, context } from "alem";
import ProfileImage from "./ProfileImage";
import Checkmark from "./Checkmark";

const InlineBlock = (props: any) => {
  const accountId = props.accountId ?? context.accountId;

  const profile = props.profile ?? Social.getr(`${accountId}/profile`);
  const fast = props.fast ?? !props.profile;

  const name = profile.name;
  const description = profile.description;
  const tags = Object.keys(profile.tags ?? {});

  const imgWrapperStyle = { height: "3em", width: "3em" };

  return (
    <div className="d-flex flex-row">
      <div className="me-2">
        <ProfileImage
          {...{
            fast,
            profile,
            accountId,
            style: imgWrapperStyle,
            imageClassName: "rounded-circle w-100 h-100",
          }}
        />
      </div>
      <div className="text-truncate">
        <div className="text-truncate">
          <span className="fw-bold">{name}</span> <Checkmark accountId={accountId} />
          <small>
            <span className="font-monospace">@{accountId}</span>
          </small>
        </div>
        <div className="text-truncate text-muted">
          {tags.length > 0 && (
            <>
              {tags.map((tag, i) => (
                <span key={i} className="me-1 fw-light badge border border-secondary text-bg-light">
                  #{tag}
                </span>
              ))}
            </>
          )}
          {!props.hideDescription && description}
        </div>
      </div>
    </div>
  );
};

export default InlineBlock;
