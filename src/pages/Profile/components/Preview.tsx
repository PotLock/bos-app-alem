import ProfileImage from "@app/components/mob.near/ProfileImage";
import hrefWithParams from "@app/utils/hrefWithParams";
import { Social, context } from "alem";

const Preview = (props: any) => {
  const accountId = props.accountId ?? context.accountId;
  const profile = Social.getr<any>(`${accountId}/profile`);

  const name = profile.name;
  // const image = profile.image;

  return (
    <div className="profile d-inline-block">
      <a href={hrefWithParams(`?tab=profile&accountId=${accountId}`)} className="text-decoration-none link-dark">
        <ProfileImage
          {...{
            profile,
            accountId,
            className: "float-start d-inline-block me-2",
          }}
        />
        <div className="profile-info d-inline-block" style={{ maxWidth: "16em" }}>
          <div className="profile-name text-truncate">{name || "No-name profile"}</div>
          <div className="profile-links d-flex">
            <div className="d-inline-block profile-account text-secondary text-truncate">@{accountId}</div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default Preview;
