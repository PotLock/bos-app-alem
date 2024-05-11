import { state } from "alem";
import constants from "@app/constants";

const getSocialData = () => {
  const { ownerId } = constants;

  // format smart contracts
  const formattedSmartContracts = state.smartContracts.reduce((accumulator: any, [chain, contractAddress]: any) => {
    if (!chain || !contractAddress) return accumulator; // Skip empty entries
    // If the chain doesn't exist in the accumulator, initialize it with an empty object
    if (!accumulator[chain]) {
      accumulator[chain] = {};
    }
    // Add the contractAddress with an empty string as its value under the chain
    accumulator[chain][contractAddress] = "";
    return accumulator; // Return the updated accumulator for the next iteration
  }, {});

  return {
    // basic profile details
    profile: {
      name: state.name,
      plCategories: JSON.stringify(state.categories),
      description: state.description,
      plPublicGoodReason: state.publicGoodReason,
      plSmartContracts: formattedSmartContracts ? JSON.stringify(formattedSmartContracts) : null,
      plGithubRepos: JSON.stringify(
        Object.values(state.githubRepos)
          .map(({ value, err }: any) => (err ? false : "github.com/" + value))
          .filter((val: any) => val),
      ),
      plFundingSources: JSON.stringify(state.fundingSources),
      linktree: {
        website: state.website,
        twitter: state.twitter,
        telegram: state.telegram,
        github: state.github,
      },
      plTeam: JSON.stringify(state.teamMembers),
    },
    // follow & star Potlock
    index: {
      star: {
        key: {
          type: "social",
          path: `${ownerId}/widget/Index`,
        },
        value: {
          type: "star",
        },
      },
      notify: {
        key: ownerId,
        value: {
          type: "star",
          item: {
            type: "social",
            path: `${ownerId}/widget/Index`,
          },
        },
      },
    },
    graph: {
      star: {
        [ownerId]: {
          widget: {
            Index: "",
          },
        },
      },
      follow: {
        [ownerId]: "",
      },
    },
  };
};

export default getSocialData;
