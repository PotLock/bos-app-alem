import { Near, State } from "alem";
import getTeamMembersFromSocialProfileData from "@app/utils/getTeamMembersFromSocialProfileData";
import { CATEGORY_MAPPINGS } from "./fields";
import { extractRepoPath } from "./helpers";

interface GithubRepos {
  [idx: string]: { value: string; err: string };
}

const setSocialData = (accountId: string, shouldSetTeamMembers?: any) => {
  Near.asyncView("social.near", "get", { keys: [`${accountId}/**`] })
    .then((socialData) => {
      if (!socialData || !socialData[accountId].profile) {
        State.update({
          socialDataFetched: true,
          name: "",
          originalCategories: [],
          categories: [],
          description: "",
          website: "",
          twitter: "",
          telegram: "",
          github: "",
          teamMembers: [],
        });
        return;
      }
      const profileData = socialData[accountId].profile;
      const backgroundImage = profileData.backgroundImage;
      const profileImage = profileData.image || "";
      const description = profileData.description || "";
      const publicGoodReason = profileData.plPublicGoodReason || "";
      let categories = [];

      if (profileData.plCategories) {
        categories = JSON.parse(profileData.plCategories);
      } else if (profileData.category) {
        // old/deprecated version
        if (typeof profileData.category == "string") {
          const availableCategory = CATEGORY_MAPPINGS[CATEGORY_MAPPINGS._deprecated[profileData.category]];
          if (availableCategory) {
            categories.push(availableCategory);
          }
        }
      }
      const smartContracts = profileData.plSmartContracts
        ? Object.entries(JSON.parse(profileData.plSmartContracts)).reduce(
            (accumulator: any, [chain, contracts]: any) => {
              // Iterate over each contract address in the current chain
              const contractsForChain = Object.keys(contracts).map((contractAddress) => {
                return [chain, contractAddress]; // Create an array with the chain and contract address
              });

              return accumulator.concat(contractsForChain); // Add the arrays for this chain to the accumulator
            },
            [],
          )
        : [];
      const hasSmartContracts = smartContracts.length > 0;
      smartContracts.push(["", ""]); // Add an empty string to the end of the array to allow for adding new contracts

      const githubRepos: GithubRepos = {};

      if (profileData.plGithubRepos) {
        JSON.parse(profileData.plGithubRepos).forEach((repo: string, idx: string) => {
          githubRepos[idx] = extractRepoPath(repo);
        });
      }

      const originalGithubRepos = githubRepos;
      // githubRepos.push([""]); // Add an empty string to the end of the array to allow for adding new repos

      const fundingSources = profileData.plFundingSources ? JSON.parse(profileData.plFundingSources) : [];
      const hasReceivedFunding = fundingSources.length > 0;

      const linktree = profileData.linktree || {};
      const twitter = linktree.twitter || "";
      const telegram = linktree.telegram || "";
      const github = linktree.github || "";
      const website = linktree.website || "";
      const team = getTeamMembersFromSocialProfileData(profileData);
      // update state
      const stateUpdates: any = {
        existingSocialData: socialData[accountId],
        backgroundImage,
        profileImage,
        name: profileData?.name || "",
        description,
        publicGoodReason,
        originalCategories: categories,
        categories,
        hasSmartContracts,
        originalSmartContracts: smartContracts,
        smartContracts,
        originalGithubRepos,
        githubRepos,
        hasReceivedFunding,
        originalFundingSources: fundingSources,
        fundingSources,
        twitter,
        telegram,
        github,
        website,
        socialDataFetched: true,
      };
      if (backgroundImage) {
        stateUpdates.backgroundImage = backgroundImage;
      }
      if (shouldSetTeamMembers) {
        stateUpdates.teamMembers = team;
      }
      State.update(stateUpdates);
    })
    .catch((e: Error) => {
      console.log("error getting social data: ", e);
      State.update({ socialDataFetched: true });
    });
};

export default setSocialData;
