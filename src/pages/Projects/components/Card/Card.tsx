import { Social, State, VM, Widget, context, useEffect, useMemo, useState } from "alem";
import CardSkeleton from "../CardSkeleton";
import {
  Amount,
  AmountDescriptor,
  BackgroundImageContainer,
  CardContainer,
  CardLink,
  DonationButton,
  DonationsInfoContainer,
  DonationsInfoItem,
  HeaderContainer,
  Info,
  MatchingAmount,
  MatchingSection,
  MatchingTitle,
  ProfileImageContainer,
  SubTitle,
  Tag,
  Tags,
  Title,
} from "./styles";
import PotSDK from "../../../../SDK/pot";
import DonateSDK from "../../../../SDK/donate";
import hrefWithParams from "../../../../utils/hrefWithParams";
import ipfsUrlFromCid from "../../../../utils/ipfsUrlFromCid";
import yoctosToNear from "../../../../utils/yoctosToNear";
import yoctosToUsdWithFallback from "../../../../utils/yoctosToUsdWithFallback";
import getTagsFromSocialProfileData from "../../../../utils/getTagsFromSocialProfileData";

const Card = (props: any) => {
  const { potId, payoutDetails } = props;

  // TODO: Bug -> não esta importando o utils
  // Só importa funcóes que retornam algo, um objeto direto está falhando.
  // const { ipfsUrlFromCid, yoctosToNear, yoctosToUsdWithFallback } = utils;
  // console.log(utils);

  const [ready, isReady] = useState(false);

  State.init({
    donateModal: {
      isOpen: false,
      recipientId: null,
      referrerId: null,
      potId: null,
      potDetail: null,
      successfulDonation: null,
    },
  });

  const openDonateModal = () => {
    State.update({
      donateModal: {
        isOpen: true,
        recipientId: projectId,
        referrerId: null,
        potId: null,
        potDetail: null,
        successfulDonation: null,
      },
    });
  };

  const projectId = props.project.id || props.projectId;
  const profile = Social.getr(`${projectId}/profile`) as any;

  const MAX_DESCRIPTION_LENGTH = 80;

  const { name, description } = profile;

  const donationsForProject = potId
    ? PotSDK.getDonationsForProject(potId, projectId)
    : DonateSDK.getDonationsForRecipient(projectId);

  useEffect(() => {
    if (profile && donationsForProject && !ready) {
      isReady(true);
    }
  }, [profile, donationsForProject]);

  const [totalAmountNear, totalDonors] = useMemo(() => {
    if (!donationsForProject) return ["0", 0];
    const donors: any = [];
    let totalDonationAmountNear = new Big(0);
    for (const donation of donationsForProject) {
      if (!donors.includes(donation.donor_id)) {
        donors.push(donation.donor_id);
      }
      // if (donation.ft_id === "near" || donation.base_currency === "near") {
      totalDonationAmountNear = totalDonationAmountNear.plus(new Big(donation.total_amount));
      // }
    }
    return [totalDonationAmountNear.toString(), donors.length];
  }, [donationsForProject]);

  const projectUrl = hrefWithParams(`?tab=project&projectId=${projectId}`);

  const getImageSrc = (image: any) => {
    // console.log(image);
    const defaultImageUrl = "https://ipfs.near.social/ipfs/bafkreih4i6kftb34wpdzcuvgafozxz6tk6u4f5kcr2gwvtvxikvwriteci";
    if (!image) return defaultImageUrl;
    const { url, ipfs_cid } = image;
    if (ipfs_cid) {
      return ipfsUrlFromCid(ipfs_cid);
    } else if (url) {
      return url;
    }
    return defaultImageUrl;
  };

  const backgroundImageStyle = {
    objectFit: "cover",
    left: 0,
    top: 0,
    height: "168px",
    borderRadius: "6px 6px 0px 0px",
    pointerEvents: "none",
  };

  const profileImageStyle = {
    width: "40px",
    height: "40px",
    position: "absolute",
    bottom: "-10px",
    left: "14px",
    pointerEvents: "none",
  };

  const tags = getTagsFromSocialProfileData(profile);

  if (!ready) return <CardSkeleton />;

  return (
    <>
      <CardLink href={projectUrl} key={projectId}>
        <CardContainer>
          <HeaderContainer className="pt-0 position-relative">
            <BackgroundImageContainer>
              {profile.backgroundImage?.nft ? (
                <Widget
                  src="mob.near/widget/Image"
                  props={{
                    image: profile.backgroundImage,
                    alt: "background",
                    className: "position-absolute w-100",
                    style: backgroundImageStyle,
                    fallbackUrl:
                      "https://ipfs.near.social/ipfs/bafkreih4i6kftb34wpdzcuvgafozxz6tk6u4f5kcr2gwvtvxikvwriteci",
                  }}
                />
              ) : (
                <img
                  className="position-absolute w-100"
                  style={backgroundImageStyle}
                  src={getImageSrc(profile.backgroundImage)}
                  alt="background"
                />
              )}
            </BackgroundImageContainer>
            <ProfileImageContainer className="profile-picture d-inline-block">
              {profile.image?.nft ? (
                <Widget
                  src="mob.near/widget/Image"
                  props={{
                    image: profile.image,
                    alt: "avatar",
                    className: "rounded-circle w-100 img-thumbnail d-block",
                    style: profileImageStyle,
                    fallbackUrl:
                      "https://ipfs.near.social/ipfs/bafkreih4i6kftb34wpdzcuvgafozxz6tk6u4f5kcr2gwvtvxikvwriteci",
                  }}
                />
              ) : (
                <img
                  className="rounded-circle w-100 img-thumbnail d-block"
                  style={profileImageStyle}
                  src={getImageSrc(profile.image)}
                  alt="avatar"
                />
              )}
            </ProfileImageContainer>
          </HeaderContainer>
          <Info>
            <Title>{name}</Title>
            <SubTitle>
              {description.length > MAX_DESCRIPTION_LENGTH
                ? description.slice(0, MAX_DESCRIPTION_LENGTH) + "..."
                : description}
            </SubTitle>
            {!tags.length ? (
              "No tags"
            ) : (
              <Tags>
                {tags.map((tag: any, tagIndex: number) => (
                  <Tag key={tagIndex}>{tag}</Tag>
                ))}
              </Tags>
            )}
          </Info>
          <DonationsInfoContainer>
            <DonationsInfoItem>
              <Amount>{totalAmountNear ? yoctosToUsdWithFallback(totalAmountNear, true) : "-"}</Amount>
              <AmountDescriptor>Raised</AmountDescriptor>
            </DonationsInfoItem>
            {payoutDetails && (
              <DonationsInfoItem>
                <Amount>{payoutDetails.donorCount}</Amount>
                <AmountDescriptor>{payoutDetails.donorCount === 1 ? "Donor" : "Donors"}</AmountDescriptor>
              </DonationsInfoItem>
            )}
            {props.allowDonate && context.accountId && (
              <DonationButton
                onClick={(e) => {
                  e.preventDefault();
                  openDonateModal();
                }}
                disabled={!context.accountId}
              >
                {props.requireVerification ? "Verify to donate" : "Donate"}
              </DonationButton>
            )}
          </DonationsInfoContainer>
          {payoutDetails && (
            <MatchingSection>
              <MatchingTitle>Estimated matched amount</MatchingTitle>
              <MatchingAmount>{yoctosToNear(payoutDetails.matchingAmount, true) || "- N"}</MatchingAmount>
            </MatchingSection>
          )}
        </CardContainer>
      </CardLink>
    </>
  );
};

export default Card;
