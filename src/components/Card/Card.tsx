import { Big, RouteLink, Social, context, useEffect, useMemo, useParams, useState } from "alem";
import CardSkeleton from "../../pages/Projects/components/CardSkeleton";
import {
  Amount,
  AmountDescriptor,
  BackgroundImageContainer,
  CardContainer,
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
import PotSDK from "@app/SDK/pot";
import DonateSDK from "@app/SDK/donate";
import ipfsUrlFromCid from "@app/utils/ipfsUrlFromCid";
import getTagsFromSocialProfileData from "@app/utils/getTagsFromSocialProfileData";
import routesPath from "@app/routes/routesPath";
import yoctosToUsdWithFallback from "@app/utils/yoctosToUsdWithFallback";
import yoctosToNear from "@app/utils/yoctosToNear";
import Image from "../mob.near/Image";
import _address from "@app/utils/_address";
import { useDonationModal } from "@app/hooks/useDonationModal";
import Button from "../Button";

const Card = (props: any) => {
  const { payoutDetails, allowDonate: _allowDonate } = props;
  const { potId } = useParams();

  const { setDonationModalProps } = useDonationModal();

  // TODO: Bug -> não esta importando o utils
  // Só importa funcóes que retornam algo, um objeto direto está falhando.
  // const { ipfsUrlFromCid, yoctosToNear, yoctosToUsdWithFallback } = utils;
  // console.log(utils);

  const [ready, isReady] = useState(false);

  const projectId = props.project.registrant_id || props.projectId;
  const profile = Social.getr(`${projectId}/profile`) as any;

  const allowDonate = _allowDonate ?? true;

  const MAX_DESCRIPTION_LENGTH = 80;

  const { name, description } = profile;

  const donationsForProject =
    potId && !payoutDetails
      ? PotSDK.getDonationsForProject(potId, projectId)
      : !potId
      ? DonateSDK.getDonationsForRecipient(projectId)
      : [];

  useEffect(() => {
    if (profile !== null && !ready) {
      isReady(true);
    }
  }, [profile, donationsForProject]);

  const totalAmountNear = useMemo(() => {
    if (payoutDetails) return payoutDetails.totalAmount;
    if (!donationsForProject) return "0";
    let totalDonationAmountNear = new Big(0);
    for (const donation of donationsForProject) {
      if (donation.ft_id === "near" || donation.base_currency === "near" || potId) {
        totalDonationAmountNear = totalDonationAmountNear.plus(new Big(donation.total_amount));
      }
    }
    return totalDonationAmountNear.toString();
  }, [donationsForProject, payoutDetails]);

  const getImageSrc = (image: any) => {
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
    objectFit: "cover" as any,
    left: 0,
    top: 0,
    height: "168px",
    borderRadius: "6px 6px 0px 0px",
    pointerEvents: "none" as any,
  };

  const profileImageStyle = {
    width: "40px",
    height: "40px",
    position: "absolute" as any,
    bottom: "-10px",
    left: "14px",
    pointerEvents: "none" as any,
  };

  const tags = getTagsFromSocialProfileData(profile);

  if (!ready) return <CardSkeleton />;

  return (
    <>
      <RouteLink to={routesPath.PROJECT_DETAIL_TAB} params={{ projectId, ...(potId ? { potId } : {}) }}>
        <CardContainer>
          <HeaderContainer className="pt-0 position-relative">
            <BackgroundImageContainer>
              {profile.backgroundImage?.nft ? (
                <Image
                  {...{
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
                <Image
                  {...{
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
            <Title>{_address(name, 30) || _address(projectId, 30)}</Title>
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
              <Amount>{totalAmountNear ? yoctosToUsdWithFallback(totalAmountNear) : "-"}</Amount>
              <AmountDescriptor>Raised</AmountDescriptor>
            </DonationsInfoItem>
            {payoutDetails && (
              <DonationsInfoItem>
                <Amount>{payoutDetails.donorCount}</Amount>
                <AmountDescriptor>{payoutDetails.donorCount === 1 ? "Donor" : "Donors"}</AmountDescriptor>
              </DonationsInfoItem>
            )}
            {allowDonate && context.accountId && (
              <Button
                varient="tonal"
                onClick={(e) => {
                  e.preventDefault();
                  setDonationModalProps({
                    projectId,
                  });
                }}
                disabled={!context.accountId}
              >
                Donate
              </Button>
            )}
          </DonationsInfoContainer>
          {payoutDetails && (
            <MatchingSection>
              <MatchingTitle>Estimated matched amount</MatchingTitle>
              <MatchingAmount>{yoctosToNear(payoutDetails.matchingAmount) || "- N"}</MatchingAmount>
            </MatchingSection>
          )}
        </CardContainer>
      </RouteLink>
    </>
  );
};

export default Card;
