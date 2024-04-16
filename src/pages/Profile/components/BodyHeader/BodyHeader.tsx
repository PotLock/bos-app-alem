import { Near, context, useMemo } from "alem";
import { AccountId, AccountInfoContainer, Container, Header, Info, Name, NameContainer } from "./styles";
import { ownerId } from "../../../../constants";
import CopyIcon from "../../../Project/components/CopyIcon";
import Button from "../../../../components/Button";
import hrefWithParams from "../../../../utils/hrefWithParams";
import ProfileTags from "../ProfileTags";
import Linktree from "../Linktree/Linktree";
import DonationsInfo from "../../../Project/components/DonationsInfo/DonationsInfo";

type Props = {
  profile: any;
  accountId?: string;
  projectId?: string;
};

const BodyHeader = ({ profile, accountId, projectId }: Props) => {
  const name = profile.name;
  const policy = projectId ? Near.view(projectId, "get_policy", {}) : (false as any);
  const isDao = !!policy;

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
                type="secondary"
                text="Edit profile"
                style={{ marginLeft: "auto" }}
                href={hrefWithParams(`?tab=editproject&projectId=${projectId}`)}
              />
            )}
            {accountId === context.accountId && !projectId && (
              <Button
                type="secondary"
                text="Edit profile"
                style={{ marginLeft: "auto" }}
                href={hrefWithParams(`?tab=editprofile`)}
              />
            )}
          </NameContainer>
          <ProfileTags projectId={projectId} />
          <Linktree projectId={projectId} accountId={accountId} />
        </Info>
        {projectId && <DonationsInfo accountId={id} projectId={projectId} />}
      </Container>
    </Header>
  );
};

export default BodyHeader;
