import { Markdown, Social } from "alem";
import CopyIcon from "../../components/CopyIcon";
import { Container, GithubWrapper, Header, HeaderContainer, SmartContractWrapper } from "./styles";
import AboutItem from "../../components/AboutItem";
import Team from "../../components/Team/Team";
import getTeamMembersFromSocialProfileData from "@app/utils/getTeamMembersFromSocialProfileData";

type Props = {
  projectId: string;
  accountId: string;
};

const About = ({ projectId, accountId }: Props) => {
  const profile = Social.getr(`${projectId}/profile`) as any;

  if (!profile) {
    return "";
  }

  const { name, description, plPublicGoodReason } = profile;

  const smartContracts = profile.plSmartContracts
    ? Object.entries(JSON.parse(profile.plSmartContracts)).reduce((accumulator, [chain, contracts]: any) => {
        // Iterate over each contract address in the current chain
        const contractsForChain: any = Object.keys(contracts).map((contractAddress) => {
          return [chain, contractAddress]; // Create an array with the chain and contract address
        });

        return accumulator.concat(contractsForChain); // Add the arrays for this chain to the accumulator
      }, [])
    : [];

  const githubRepos = profile.plGithubRepos ? JSON.parse(profile.plGithubRepos) : [];

  const Github = () =>
    githubRepos.length > 0 ? (
      <GithubWrapper>
        {githubRepos.map((url: string) => (
          <a href={url} target="_blank">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 0.5V2.5H10.09L0.5 12.09L1.91 13.5L11.5 3.91V12.5H13.5V0.5H1.5Z" fill="#7B7B7B" />
            </svg>
            <div className="url">{url}</div>
          </a>
        ))}
      </GithubWrapper>
    ) : (
      "None provided"
    );

  const SmartContracts = () =>
    smartContracts.length > 0 ? (
      <SmartContractWrapper>
        {smartContracts.map(([chain, contract]: any) => {
          return (
            <div className="contract">
              <CopyIcon textToCopy={contract} />
              <div className="text">
                <div className="address">{contract}</div>
                <div className="chain">{chain}</div>
              </div>
            </div>
          );
        })}
      </SmartContractWrapper>
    ) : (
      "None provided"
    );

  const markdown = <Markdown text={description} />;
  const github = <Github />;
  const smartContractsItems = <SmartContracts />;

  return (
    <Container>
      <HeaderContainer>
        <Header>About {name}</Header>
      </HeaderContainer>
      <AboutItem title="Overview" text={markdown} />
      <AboutItem title="Why we are a public good" text={plPublicGoodReason || "None provided"} />
      <Team team={getTeamMembersFromSocialProfileData(profile)} />
      <AboutItem title="Github repo(s)" text={github} />
      <AboutItem title="Smart contracts" text={smartContractsItems} />
    </Container>
  );
};

export default About;
