import { Files, Near, Social, Widget, context, props } from "alem";
import { Project } from "../../../../types";
import {
  BackgroundImageContainer,
  Container,
  ProfileImageContainer,
  ProfileStats,
  ProfileWraper,
  // Verified,
} from "./styles";
import CameraSvg from "../../../../assets/svgs/camera";
import ProfileImage from "../../../Project/components/ProfileImage";
import FollowStats from "../FollowStats";
import styled from "styled-components";

type Props = {
  showFollowers: boolean;
  project: Project;
  projectId: string;
  accountId: string;
};

// TODO: Bug: As propriedades só são vistas se colocadas aqui entre chaves
// se nao colocar, não pega as props.
const BannerHeader = ({ showFollowers, project, projectId, accountId: _accountId }: Props) => {
  const accountId = _accountId || projectId || context.accountId;

  if (!accountId) {
    return "No account ID";
  }

  const editable = props.bgImageOnChange && props.profileImageOnChange;

  const profile = props.profile ?? Social.getr(`${accountId}/profile`);

  const name = profile.name || "No-name profile";
  const image = profile.image;
  const backgroundImage = props.backgroundImage || profile.backgroundImage;
  const profileImage = props.profileImage || image;
  const imageStyle = props.imageStyle ?? {};
  const backgroundStyle = props.backgroundStyle ?? {};
  const containerStyle = props.containerStyle ?? {};

  const isVerified = projectId
    ? project.status === "Approved"
    : Near.view("v1.nadabot.near", "is_human", {
        account_id: accountId,
      });

  const Verified = styled.div`
    opacity: 1;
    display: flex;
    align-items: center;
    font-size: 11px;
    letter-spacing: 0.88px;
    gap: 4px;
    overflow: hidden;
    ${!isVerified
      ? `
        width: 10px;
        opacity: 0;
        `
      : ""}
    div {
      font-weight: 600;
      color: #0e615e;
    }
    svg {
      background: white;
      border-radius: 50%;
    }
    @media screen and (max-width: 768px) {
      div {
        display: none;
      }
    }
  `;

  // TEMP: está quebrando dentro do FollowStats. Preciso de mais tempo
  // para arrumar o compilador. Ver erro10.txt
  const following = Social.keys(`${accountId}/graph/follow/*`, "final", {
    return_type: "BlockHeight",
    values_only: true,
  });

  return (
    <Container className="pt-0 position-relative" style={{ ...containerStyle }}>
      <BackgroundImageContainer>
        <Widget
          src="mob.near/widget/Image"
          props={{
            image: backgroundImage,
            alt: "profile background",
            style: { ...backgroundStyle, pointerEvents: "none" },
            fallbackUrl: "https://ipfs.near.social/ipfs/bafkreih4i6kftb34wpdzcuvgafozxz6tk6u4f5kcr2gwvtvxikvwriteci",
          }}
        />
        <CameraSvg />
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
            onChange={props.bgImageOnChange}
          />
        )}
      </BackgroundImageContainer>
      <ProfileWraper>
        <ProfileImageContainer>
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
              onChange={props.profileImageOnChange}
            ></Files>
          )}
        </ProfileImageContainer>
        {showFollowers && (
          <ProfileStats>
            <Verified isVerified={!!isVerified}>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12.9354 2.94366C12.5353 2.45498 11.788 2.45498 11.3879 2.94366L10.598 3.90853C10.326 4.24068 9.87244 4.36222 9.47086 4.21054L8.3043 3.76991C7.71347 3.54675 7.06627 3.92041 6.96412 4.54367L6.76243 5.77425C6.693 6.19787 6.36095 6.52991 5.93734 6.59934L4.70675 6.80103C4.08349 6.90319 3.70984 7.55038 3.933 8.14121L4.37362 9.30778C4.5253 9.70935 4.40377 10.1629 4.07162 10.4349L3.10675 11.2248C2.61806 11.6249 2.61806 12.3722 3.10675 12.7723L4.07162 13.5623C4.40377 13.8342 4.5253 14.2878 4.37362 14.6894L3.933 15.856C3.70984 16.4468 4.08349 17.094 4.70675 17.1961L5.93734 17.3978C6.36095 17.4673 6.693 17.7993 6.76243 18.2229L6.96412 19.4535C7.06627 20.0768 7.71346 20.4504 8.3043 20.2273L9.47086 19.7866C9.87244 19.635 10.326 19.7565 10.598 20.0886L11.3879 21.0535C11.788 21.5422 12.5353 21.5422 12.9354 21.0535L13.7254 20.0886C13.9973 19.7565 14.4509 19.635 14.8525 19.7866L16.019 20.2273C16.6099 20.4504 17.2571 20.0768 17.3592 19.4535L17.5609 18.2229C17.6303 17.7993 17.9624 17.4673 18.386 17.3978L19.6166 17.1961C20.2399 17.094 20.6135 16.4468 20.3903 15.856L19.9497 14.6894C19.798 14.2878 19.9196 13.8342 20.2517 13.5623L21.2166 12.7723C21.7053 12.3722 21.7053 11.6249 21.2166 11.2248L20.2517 10.4349C19.9196 10.1629 19.798 9.70935 19.9497 9.30778L20.3903 8.14121C20.6135 7.55038 20.2399 6.90319 19.6166 6.80103L18.386 6.59934C17.9624 6.52991 17.6303 6.19787 17.5609 5.77425L17.3592 4.54367C17.2571 3.92041 16.6099 3.54675 16.019 3.76991L14.8525 4.21054C14.4509 4.36222 13.9973 4.24068 13.7254 3.90853L12.9354 2.94366ZM15.6549 9.49597C15.4584 9.30185 15.1418 9.30366 14.9476 9.50002L11.0784 13.412L9.41138 11.5375C9.22787 11.3311 8.91183 11.3126 8.70548 11.4961C8.49913 11.6796 8.48062 11.9957 8.66413 12.202L11.0377 14.871L12.059 13.8497L15.6592 10.2032C15.8533 10.0067 15.8513 9.6901 15.6549 9.49597Z"
                  fill="#0DBFAF"
                />
              </svg>
              <div> VERIFIED</div>
            </Verified>
            <FollowStats following={following} accountId={projectId || accountId} projectId={projectId} />
          </ProfileStats>
        )}
      </ProfileWraper>
      {props.children && props.children}
    </Container>
  );
};

export default BannerHeader;
