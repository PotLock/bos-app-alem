import { Social } from "alem";
import GithubSvg from "@app/assets/svgs/github";
import NearSvg from "@app/assets/svgs/near";
import TwitterSvg from "@app/assets/svgs/twitter";
import WebsiteSvg from "@app/assets/svgs/website";
import { LinktreeContainer, LinktreeItemContainer } from "./styled";

type Props = {
  projectId: string;
  accountId: string;
};

const Linktree = ({ projectId, accountId }: Props) => {
  const profile = Social.getr(`${projectId}/profile`) as any;

  const linktree = profile?.linktree;

  if (!linktree) return "";

  const itemIconUrls = {
    github: <GithubSvg />,
    twitter: <TwitterSvg />,
    website: <WebsiteSvg />,
    NEAR: <NearSvg />,
  };

  const fullUrls: Record<string, any> = {
    twitter: (handle: string) => `https://twitter.com/${handle.trim()}`,
    github: (username: string) => `https://github.com/${username.trim()}`,
    website: (url: string) => (url.includes("http") ? url : `https://${url.trim()}`),
  };

  return (
    <LinktreeContainer>
      {Object.entries(linktree).map(([k, v], idx) => {
        return k in itemIconUrls && v ? (
          <LinktreeItemContainer
            href={fullUrls[k](v)}
            // disabled={!v}
            onClick={(e) => {
              if (!v) {
                e.preventDefault();
              }
            }}
            target="_blank"
          >
            {itemIconUrls[k]}
          </LinktreeItemContainer>
        ) : null;
      })}
      <LinktreeItemContainer
        target="_blank"
        href={`https://near.social/mob.near/widget/ProfilePage?accountId=${projectId || accountId}`}
      >
        {itemIconUrls.NEAR}
      </LinktreeItemContainer>
    </LinktreeContainer>
  );
};

export default Linktree;
