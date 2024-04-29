import { Files, Near, Social, context, useParams } from "alem";
import { Project } from "@app/types";
import CameraSvg from "@app/assets/svgs/camera";
import ProfileImage from "@app/components/mob.near/ProfileImage";
import FollowStats from "../FollowStats";
import statuses from "./statuses";
import Image from "@app/components/mob.near/Image";
import {
  BackgroundImageContainer,
  Container,
  ProfileImageContainer,
  ProfileStats,
  ProfileWraper,
  Verified,
} from "./styles";

type Props = {
  showFollowers?: boolean;
  registration?: Project;
  projectId?: string;
  accountId?: string;
  bgImageOnChange?: (files: any) => void;
  profileImageOnChange?: (files: any) => void;
  profile?: any;
  profileImage?: any;
  backgroundImage?: any;
  imageStyle?: any;
  backgroundStyle?: any;
  containerStyle?: any;
  children?: any;
};

const BannerHeader = (props: Props) => {
  const { showFollowers, registration, projectId, profileImageOnChange, bgImageOnChange } = props;
  const accountId = props.accountId || projectId || context.accountId;

  if (!accountId) {
    return "No account ID";
  }

  const editable = bgImageOnChange && profileImageOnChange;

  const profile = props.profile ?? Social.getr(`${accountId}/profile`);

  const image = profile.image;
  const backgroundImage = props.backgroundImage || profile.backgroundImage;
  const profileImage = props.profileImage || image;
  const imageStyle = props.imageStyle ?? {};
  const backgroundStyle = props.backgroundStyle ?? {};
  const containerStyle = props.containerStyle ?? {};

  const nadaBotVerified = Near.view("v1.nadabot.near", "is_human", {
    account_id: accountId,
  });

  return (
    <Container style={{ ...containerStyle }}>
      <BackgroundImageContainer
        className={editable ? "editable" : ""}
        style={{ height: backgroundStyle.height ? backgroundStyle.height : "" }}
      >
        <Image
          {...{
            image: backgroundImage,
            alt: "profile background",
            style: { ...backgroundStyle, pointerEvents: "none" },
            fallbackUrl: "https://ipfs.near.social/ipfs/bafkreih4i6kftb34wpdzcuvgafozxz6tk6u4f5kcr2gwvtvxikvwriteci",
          }}
        />
        <CameraSvg height={48} />
        {editable && (
          <Files
            multiple={false}
            accepts={["image/*"]}
            minFileSize={1}
            style={{
              zIndex: 4,
              top: 0,
              width: "100%",
              height: backgroundStyle.height ?? "100%",
              position: "absolute",
            }}
            clickable
            onChange={bgImageOnChange}
          />
        )}
      </BackgroundImageContainer>
      <ProfileWraper>
        <ProfileImageContainer className={editable ? "editable" : ""}>
          <CameraSvg height={24} />
          <ProfileImage
            profile={profile}
            accountId={accountId}
            style={{ ...imageStyle }}
            imageClassName="rounded-circle"
            image={profileImage}
          />

          {editable && (
            <Files
              multiple={false}
              accepts={["image/*"]}
              minFileSize={1}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                left: 0,
                top: 0,
              }}
              clickable
              onChange={profileImageOnChange}
            ></Files>
          )}
        </ProfileImageContainer>
        {showFollowers && (
          <ProfileStats>
            {registration ? (
              <Verified>
                {statuses[registration.status].icon}
                <div style={{ color: statuses[registration.status].color }}> {registration.status}</div>
              </Verified>
            ) : nadaBotVerified ? (
              <Verified>
                {statuses.Approved.icon}
                <div style={{ color: statuses.Approved.color }}> Verified</div>
              </Verified>
            ) : (
              <div
                style={{
                  width: "10px",
                }}
              />
            )}
            <FollowStats accountId={projectId || accountId} projectId={projectId} />
          </ProfileStats>
        )}
      </ProfileWraper>
      {props.children && props.children}
    </Container>
  );
};

export default BannerHeader;
