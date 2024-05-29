import { Near, clipboard, context, useMemo, useState } from "alem";
import CheckIcon from "@app/assets/svgs/CheckIcon";
import ReferrerIcon from "@app/assets/svgs/ReferrerIcon";
import Button from "@app/components/Button";
import constants from "@app/constants";
import CopyIcon from "@app/pages/Project/components/CopyIcon";
import DonationsInfo from "@app/pages/Project/components/DonationsInfo/DonationsInfo";
import FollowButton from "@app/pages/Project/components/FollowButton/FollowButton";
import hrefWithParams from "@app/utils/hrefWithParams";
import Linktree from "../Linktree/Linktree";
import ProfileTags from "../ProfileTags";
import {
  AccountId,
  AccountInfoContainer,
  Container,
  Header,
  Info,
  Name,
  NameContainer,
  LinksWrapper,
  ReferralButton,
} from "./styles";

type Props = {
  profile: any;
  accountId?: string;
  projectId?: string;
};

const BodyHeader = ({ profile, accountId, projectId }: Props) => {
  const name = profile.name;
  const policy = projectId ? Near.view(projectId, "get_policy", {}) : (false as any);
  const isDao = !!policy;

  const { DEFAULT_URL } = constants;

  const [copid, setCopid] = useState(false);

  const userHasPermissions = useMemo(() => {
    if (!policy) return false;
    // TODO: break this out (NB: duplicated in Project.CreateForm)
    const userRoles = policy.roles.filter((role: any) => {
      if (role.kind === "Everyone") return true;
      return role.kind.Group && role.kind.Group.includes(context.accountId);
    });
    const kind = "call";
    const action = "AddProposal";
    // Check if the user is allowed to perform the action
    const allowed = userRoles.some(({ permissions }: { permissions: string }) => {
      return (
        permissions.includes(`${kind}:${action}`) ||
        permissions.includes(`${kind}:*`) ||
        permissions.includes(`*:${action}`) ||
        permissions.includes("*:*")
      );
    });
    return allowed;
  }, [policy]);

  const isOwner = projectId === context.accountId;
  const isPermissionedMember = isDao && userHasPermissions;
  const canEdit = isOwner || isPermissionedMember;

  const id = projectId || accountId || "";

  return (
    <Header>
      <Container>
        <Info>
          <NameContainer>
            <Name>{name.length > 25 ? name.slice(0, 25).trim() + "..." : name}</Name>
            <AccountInfoContainer>
              <AccountId>@ {id.length > 15 ? id.slice(0, 15).trim() + "..." : id}</AccountId>
              <CopyIcon textToCopy={id} customStyle="height: 18px;" />
            </AccountInfoContainer>
            {canEdit && (
              <Button
                varient="tonal"
                style={{ marginLeft: "auto" }}
                href={hrefWithParams(`?tab=editproject&projectId=${projectId}`)}
              >
                Edit profile
              </Button>
            )}
            {accountId === context.accountId && !projectId && (
              <Button varient="tonal" style={{ marginLeft: "auto" }} href={hrefWithParams(`?tab=editprofile`)}>
                Edit profile
              </Button>
            )}
          </NameContainer>
          <ProfileTags projectId={projectId} accountId={accountId} />
          <LinksWrapper>
            <Linktree projectId={projectId} accountId={accountId} />
            {projectId && context.accountId && (
              <ReferralButton
                onClick={() => {
                  clipboard.writeText(
                    `${DEFAULT_URL}?tab=project&projectId=${projectId}&referrerId=${context.accountId}`,
                  );
                  setCopid(true);
                  setTimeout(() => {
                    setCopid(false);
                  }, 2000);
                }}
              >
                {copid ? <CheckIcon /> : <ReferrerIcon />}
                <div>Earn referral fees</div>
              </ReferralButton>
            )}
          </LinksWrapper>
        </Info>
        {projectId ? (
          <DonationsInfo projectId={projectId} />
        ) : accountId !== context.accountId ? (
          <FollowButton accountId={accountId || ""} classname="follow-btn" />
        ) : (
          ""
        )}
      </Container>
    </Header>
  );
};

export default BodyHeader;
