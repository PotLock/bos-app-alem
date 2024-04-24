import ListsSDK from "@app/SDK/lists";
import InfoSegment from "@app/components/InfoSegment/InfoSegment";
import { Big, Near, State, asyncFetch, context, state, useEffect, useMemo, useParams } from "alem";
import {
  AddTeamMembers,
  ButtonsContainer,
  Container,
  FormBody,
  FormDivider,
  FormSectionContainer,
  FormSectionDescription,
  FormSectionIsRequired,
  FormSectionLeftDiv,
  FormSectionRightDiv,
  FormSectionTitle,
  Icon,
  InputPrefix,
  LowerBannerContainer,
  LowerBannerContainerLeft,
  LowerBannerContainerRight,
  Row,
  Space,
  SvgContainer,
  Table,
} from "./styles";
import doesUserHaveDaoFunctionCallProposalPermissions from "@app/utils/doesUserHaveDaoFunctionCallProposalPermissions";
import getTeamMembersFromSocialProfileData from "@app/utils/getTeamMembersFromSocialProfileData";
import validateNearAddress from "@app/utils/validateNearAddress";
import Button from "@app/components/Button";
import hrefWithParams from "@app/utils/hrefWithParams";
import BannerHeader from "@app/pages/Profile/components/BannerHeader/BannerHeader";
import AccountsStack from "../AccountsStack/AccountsStack";
import CheckBox from "@app/components/Inputs/Checkbox/Checkbox";
import Text from "@app/components/Inputs/Text/Text";
import TextArea from "@app/components/Inputs/TextArea/TextArea";
import SelectMultiple from "@app/components/Inputs/SelectMultiple/SelectMultiple";
import Select from "@app/components/Inputs/Select/Select";
import validateEVMAddress from "@app/utils/validateEVMAddress";
import ModalMultiAccount from "@app/components/ModalMultiAccount/ModalMultiAccount";
import ModalAddFundingSource from "../ModalAddFundingSource/ModalAddFundingSource";
import validateGithubRepoUrl from "@app/utils/validateGithubRepoUrl";

const CreateForm = (props: { edit: boolean }) => {
  const { projectId } = useParams();

  const HORIZON_CONTRACT_ID = "nearhorizon.near";
  const SOCIAL_CONTRACT_ID = "social.near";
  const ownerId = "potlock.near";
  Big.PE = 100;
  const FIFTY_TGAS = "50000000000000";
  const THREE_HUNDRED_TGAS = "300000000000000";
  const MIN_PROPOSAL_DEPOSIT_FALLBACK = "100000000000000000000000"; // 0.1N

  const DEFAULT_BANNER_IMAGE_CID = "bafkreih4i6kftb34wpdzcuvgafozxz6tk6u4f5kcr2gwvtvxikvwriteci";

  if (!context.accountId) {
    return (
      <InfoSegment
        {...{
          title: "Not logged in!",
          description: "You must log in to create a new project!",
        }}
      />
    );
  }

  const existingHorizonProject = Near.view(HORIZON_CONTRACT_ID, "get_project", {
    account_id: context.accountId,
  });

  const registrations = ListsSDK.getRegistrations() || [];

  State.init({
    isDao: false,
    daoAddressTemp: "", // used while input is focused
    daoAddress: "", // set on input blur
    daoAddressError: "",
    existingSocialData: {},
    backgroundImage: {
      ipfs_cid: DEFAULT_BANNER_IMAGE_CID,
    },
    profileImage: "",
    name: "",
    nameError: "",
    originalCategories: [], // to keep track of removals
    categories: [],
    categoriesError: "",
    description: "",
    descriptionError: "",
    publicGoodReason: "",
    publicGoodReasonError: "",
    hasSmartContracts: false,
    originalSmartContracts: [], // to keep track of removals
    smartContracts: [["", ""]], // [chain, contractAddress]
    originalGithubRepos: [], // to keep track of removals
    githubRepos: [[""]],
    hasReceivedFunding: false,
    fundingSourceIndex: null,
    originalFundingSources: [], // to keep track of removals
    fundingSources: [],
    website: "",
    websiteError: "",
    twitter: "",
    twitterError: "",
    telegram: "",
    telegramError: "",
    github: "",
    githubError: "",
    socialDataFetched: false,
    socialDataIsFetching: false,
    isMultiAccountModalOpen: false,
    teamMember: "",
    teamMembers: [],
    nearAccountIdError: "",
    registrationSuccess: false,
    showAlert: false,
    alertMessage: "",
  });

  const CATEGORY_MAPPINGS: any = {
    SOCIAL_IMPACT: "Social Impact",
    NON_PROFIT: "NonProfit",
    CLIMATE: "Climate",
    PUBLIC_GOOD: "Public Good",
    DE_SCI: "DeSci",
    OPEN_SOURCE: "Open Source",
    COMMUNITY: "Community",
    EDUCATION: "Education",
    _deprecated: {
      "social-impact": "SOCIAL_IMPACT",
      "non-profit": "NON_PROFIT",
      climate: "CLIMATE",
      "public-good": "PUBLIC_GOOD",
      "de-sci": "DE_SCI",
      "open-source": "OPEN_SOURCE",
      community: "COMMUNITY",
      education: "EDUCATION",
    },
  };

  const CHAIN_OPTIONS: any = {
    NEAR: { isEVM: false },
    Solana: { isEVM: false },
    Ethereum: { isEVM: true },
    Polygon: { isEVM: true },
    Avalanche: { isEVM: true },
    Optimism: { isEVM: true },
    Arbitrum: { isEVM: true },
    BNB: { isEVM: true },
    Sui: { isEVM: false },
    Aptos: { isEVM: false },
    Polkadot: { isEVM: false },
    Stellar: { isEVM: false },
    ZkSync: { isEVM: false }, // Note: ZkSync aims for EVM compatibility but might not fully be considered as traditional EVM at the time of writing.
    Celo: { isEVM: true },
    Aurora: { isEVM: true },
    Injective: { isEVM: true },
    Base: { isEVM: false },
    Manta: { isEVM: false }, // Listed twice in the original list; included once here.
    Fantom: { isEVM: true },
    ZkEVM: { isEVM: true }, // Considering the name, assuming it aims for EVM compatibility.
    Flow: { isEVM: false },
    Tron: { isEVM: true },
    MultiverseX: { isEVM: false }, // Formerly known as Elrond, not traditionally EVM but has some level of compatibility.
    Scroll: { isEVM: true }, // Assuming EVM compatibility based on the context of ZkEVM.
    Linea: { isEVM: true }, // Assuming non-EVM due to lack of information.
    Metis: { isEVM: true },
  };

  const accountId = projectId ? projectId : state.isDao ? state.daoAddress : context.accountId;
  const policy: any = Near.view(accountId, "get_policy", {});
  const userHasPermissions =
    policy == null
      ? false
      : policy == undefined || doesUserHaveDaoFunctionCallProposalPermissions(context.accountId, policy);

  // const userHasPermissions = useMemo(() => {
  //   if (policy == undefined) return true;
  //   if (policy == null) return false;
  //   return doesUserHaveDaoFunctionCallProposalPermissions(policy);
  // }, [policy]);

  //   const getImageUrlFromSocialImage = (image: any) => {
  //     if (image.url) {
  //       return image.url;
  //     } else if (image.ipfs_cid) {
  //       return IPFS_BASE_URL + image.ipfs_cid;
  //     }
  //   };

  //   const Modal = ({ isOpen, onClose, children }: any) => {
  //     if (!isOpen) return null;

  //     return (
  //       <ModalOverlay onClick={onClose}>
  //         <ModalContent onClick={(e) => e.stopPropagation()}>{children}</ModalContent>
  //       </ModalOverlay>
  //     );
  //   };

  const setSocialData = (accountId: string, shouldSetTeamMembers?: any) => {
    Near.asyncView("social.near", "get", { keys: [`${accountId}/**`] })
      .then((socialData) => {
        console.log("socialData: ", socialData);
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

        const githubRepos = profileData.plGithubRepos
          ? JSON.parse(profileData.plGithubRepos).map((repo: any) => [repo])
          : [];
        const originalGithubRepos = githubRepos;
        githubRepos.push([""]); // Add an empty string to the end of the array to allow for adding new repos

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
      .catch((e) => {
        console.log("error getting social data: ", e);
        State.update({ socialDataFetched: true });
      });
  };

  useEffect(() => {
    if (state.isDao && state.daoAddress) {
      setSocialData(state.daoAddress, true);
    } else if (!state.isDao && context.accountId && !state.socialDataFetched) {
      setSocialData(context.accountId, true);
    }
  }, [state.socialDataFetched, state.isDao, state.daoAddress, context.accountId]);

  console.log("state", state);

  const isCreateProjectDisabled =
    state.daoAddressError ||
    !state.name ||
    state.nameError ||
    !state.description ||
    state.descriptionError ||
    !state.publicGoodReason ||
    state.publicGoodReasonError ||
    (state.categories.includes(CATEGORY_MAPPINGS.OPEN_SOURCE) &&
      !state.githubRepos.filter((val: any) => val[0]).length) ||
    (state.hasSmartContracts && !state.smartContracts.filter((val: any) => val[0]).length) ||
    (state.hasReceivedFunding && !state.fundingSources.length) ||
    !state.categories.length ||
    state.categoriesError;

  const deepObjectDiff = (objOriginal: any, objUpdated: any) => {
    if (!objUpdated) objUpdated = {};
    let diff = {};

    function findDiff(original: any, updated: any, diffObj: any) {
      Object.keys(updated).forEach((key) => {
        const updatedValue = updated[key];
        const originalValue = original ? original[key] : undefined;

        // If both values are objects, recurse.
        if (
          typeof updatedValue === "object" &&
          updatedValue !== null &&
          (originalValue === undefined || (typeof originalValue === "object" && originalValue !== null))
        ) {
          const nestedDiff = originalValue ? findDiff(originalValue, updatedValue, {}) : updatedValue;
          if (Object.keys(nestedDiff).length > 0) {
            diffObj[key] = nestedDiff;
          }
        } else if (updatedValue !== originalValue) {
          // Direct comparison for string values.
          diffObj[key] = updatedValue;
        }
      });

      return diffObj;
    }

    return findDiff(objOriginal, objUpdated, diff);
  };

  const handleCreateOrUpdateProject = (e: any) => {
    if (isCreateProjectDisabled) return;
    const daoAddressValid = state.isDao ? validateNearAddress(state.daoAddress) : true;
    if (!daoAddressValid) {
      State.update({
        daoAddressError: "Invalid NEAR account ID",
      });
      return;
    }

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

    const socialData: any = {
      // basic profile details
      profile: {
        name: state.name,
        plCategories: JSON.stringify(state.categories),
        description: state.description,
        plPublicGoodReason: state.publicGoodReason,
        plSmartContracts: state.hasSmartContracts ? JSON.stringify(formattedSmartContracts) : null,
        plGithubRepos: JSON.stringify(state.githubRepos.map((repo: any) => repo[0]).filter((val: any) => val)),
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

    if (state.backgroundImage) {
      socialData.profile.backgroundImage = state.backgroundImage;
    }
    if (state.profileImage) {
      socialData.profile.image = state.profileImage;
    }

    const diff = deepObjectDiff(state.existingSocialData, socialData);

    const socialArgs = {
      data: {
        [accountId]: diff,
      },
    };

    const potlockRegistryArgs = {
      list_id: 1, // hardcoding to potlock registry list for now
    };
    const horizonArgs = { account_id: state.isDao ? state.daoAddress : context.accountId };

    // first, we have to get the account from social.near to see if it exists. If it doesn't, we need to add 0.1N to the deposit
    Near.asyncView(SOCIAL_CONTRACT_ID, "get_account", {
      account_id: state.isDao ? state.daoAddress : context.accountId,
    }).then((account) => {
      const socialTransaction: any = {
        contractName: SOCIAL_CONTRACT_ID,
        methodName: "set",
        args: socialArgs,
      };
      let depositFloat = JSON.stringify(socialArgs).length * 0.00015;
      if (!account) {
        depositFloat += 0.1;
      }
      socialTransaction.deposit = Big(depositFloat).mul(Big(10).pow(24));

      // instantiate transactions array that we will be passing to Near.call()
      let transactions = [socialTransaction];

      // if this is a creation action, we need to add the registry and horizon transactions
      if (!props.edit) {
        transactions.push(
          // register project on potlock
          {
            contractName: ListsSDK.getContractId(),
            methodName: "register_batch",
            deposit: Big(0.05).mul(Big(10).pow(24)),
            args: potlockRegistryArgs,
          },
        );
        if (!existingHorizonProject) {
          transactions.push(
            // register on NEAR Horizon
            {
              contractName: HORIZON_CONTRACT_ID,
              methodName: "add_project",
              args: horizonArgs,
            },
          );
        }
      }

      // if it is a DAO, we need to convert transactions to DAO function call proposals
      if (state.isDao) {
        const clonedTransactions = JSON.parse(JSON.stringify(transactions));
        transactions = clonedTransactions.map((tx: any) => {
          const action = {
            method_name: tx.methodName,
            gas: FIFTY_TGAS,
            deposit: tx.deposit ? tx.deposit.toString() : "0",
            args: Buffer.from(JSON.stringify(tx.args), "utf-8").toString("base64"),
          };
          return {
            ...tx,
            contractName: state.daoAddress,
            methodName: "add_proposal",
            args: {
              proposal: {
                description: props.edit
                  ? "Update project on Potlock (via NEAR Social)"
                  : "Create project on Potlock (3 steps: Register information on NEAR Social, register on Potlock, and register on NEAR Horizon)",
                kind: {
                  FunctionCall: {
                    receiver_id: tx.contractName,
                    actions: [action],
                  },
                },
              },
            },
            deposit: policy.proposal_bond || MIN_PROPOSAL_DEPOSIT_FALLBACK,
            gas: THREE_HUNDRED_TGAS,
          };
        });
      }
      Near.call(transactions);
      // NB: we won't get here if user used a web wallet, as it will redirect to the wallet
      // <---- EXTENSION WALLET HANDLING ---->
      // poll for updates
      const pollIntervalMs = 1000;
      // const totalPollTimeMs = 60000; // consider adding in to make sure interval doesn't run indefinitely
      const pollId = setInterval(() => {
        // This is an async request, not converting to SDK yet
        ListsSDK.asyncGetRegistration(null, context.accountId).then((_project: any) => {
          if (_project) {
            clearInterval(pollId);
            State.update({ registrationSuccess: true });
          }
        });
      }, pollIntervalMs);
    });
  };

  if (projectId) {
    Near.asyncView(projectId, "get_policy", {}).then((policy) => {
      if (policy) {
        State.update({
          isDao: true,
          daoAddress: projectId,
          daoAddressTemp: projectId,
        });
      }
    });
  }

  const registeredProject = useMemo(() => {
    return ListsSDK.getRegistration(null, state.isDao ? state.daoAddress : context.accountId);
  }, [state.isDao, state.daoAddress]);

  console.log("registeredProject: ", registeredProject);

  const proposals: any = Near.view(state.daoAddress, "get_proposals", {
    from_index: 0,
    limit: 1000,
  });

  const proposalInProgress = useMemo(() => {
    if (!state.isDao || !state.daoAddress || !proposals) return false;
    return proposals?.find((proposal: any) => {
      return (
        proposal.status == "InProgress" &&
        proposal.kind.FunctionCall?.receiver_id == ListsSDK.getContractId() &&
        proposal.kind.FunctionCall?.actions[0]?.method_name == "register"
      );
    });
  }, [state, proposals]);

  const handleAddTeamMember = () => {
    let isValid = validateNearAddress(state.teamMember);
    if (!isValid) {
      State.update({
        nearAccountIdError: "Invalid NEAR account ID",
      });
      return;
    }
    if (!state.teamMembers.find((tm: any) => tm == state.teamMember)) {
      // update state
      State.update({
        teamMembers: [...state.teamMembers, state.teamMember],
        teamMember: "",
        nearAccountIdError: "",
      });
    }
  };

  const FormSectionLeft = (title: any, description: any, isRequired: any) => {
    return (
      <FormSectionLeftDiv>
        <FormSectionTitle>{title}</FormSectionTitle>
        <FormSectionDescription>{description}</FormSectionDescription>
        <FormSectionIsRequired
          style={{
            color: isRequired ? "#DD5633" : "#7B7B7B",
          }}
        >
          {isRequired ? "Required" : "Optional"}
          {isRequired && (
            <SvgContainer style={{ top: -6, left: -26 }}>
              <svg width="117" height="31" viewBox="0 0 117 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M81.8 3.40116C82.247 3.1908 83.0709 3.13488 82.6 2.60116C81.0461 0.840105 83.0819 0.798833 78.6667 1.22338C65.6302 2.47689 52.5192 4.47997 39.6667 6.95672C31.3106 8.56697 19.0395 10.1936 12.7333 17.09C3.95785 26.6869 29.2286 29.1656 32.9333 29.3567C53.953 30.4413 75.9765 28.9386 96.5111 24.1789C99.8286 23.41 122.546 18.5335 112.733 11.5345C107.621 7.88815 100.796 6.47335 94.7333 5.75672C77.7504 3.74928 60.1141 5.22649 43.2222 7.35671C28.8721 9.16641 14.4138 11.8506 1 17.4012"
                  stroke="#2E2E2E"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
              </svg>
            </SvgContainer>
          )}
        </FormSectionIsRequired>
      </FormSectionLeftDiv>
    );
  };

  const DeleteIcon = (props: any) => (
    <Icon {...props} viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 14C2.0875 14 1.73437 13.8531 1.44062 13.5594C1.14687 13.2656 1 12.9125 1 12.5V2.5H0V1H4V0H8V1H12V2.5H11V12.491C11 12.9137 10.8531 13.2708 10.5594 13.5625C10.2656 13.8542 9.9125 14 9.5 14H2.5ZM9.5 2.5H2.5V12.5H9.5V2.5ZM4 11H5.5V4H4V11ZM6.5 11H8V4H6.5V11Z"
        fill="#7B7B7B"
      />
    </Icon>
  );

  // if (props.edit && (!registeredProject || !userHasPermissions)) { // TODO: ADD THIS BACK IN
  if (props.edit && !userHasPermissions) {
    return <h3 style={{ textAlign: "center", paddingTop: "32px" }}>Unauthorized</h3>;
  }

  const uploadFileUpdateState = (body: any, callback: any) => {
    asyncFetch("https://ipfs.near.social/add", {
      method: "POST",
      headers: { Accept: "application/json" },
      body,
    }).then(callback);
  };

  // console.log("state in create form: ", state);

  console.log(state.fundingSources);

  return (
    <Container>
      {!state.socialDataFetched || !registrations ? (
        <div className="spinner-border text-secondary" role="status" />
      ) : proposalInProgress ? (
        <Container
          style={{
            padding: "32px 16px",
            justifyContent: "center",
            alignItems: "center",
            wordWrap: "break-word",
          }}
        >
          <h1 style={{ textAlign: "center" }}>You have a DAO proposal in progress.</h1>
          <h5 style={{ wordWrap: "break-word", textAlign: "center" }}>
            Please come back once voting on your proposal has been completed.
          </h5>
          <div
            style={{
              fontStyle: "italic",
              fontFamily: "sans-serif",
              wordWrap: "break-word",
              textAlign: "center",
            }}
          >
            NB: This proposal consists of 3 steps (individual proposals): Register information on NEAR Social, register
            on Potlock, and register on NEAR Horizon.
          </div>
          <a
            target="_blank"
            href={`https://near.org/sking.near/widget/DAO.Page?daoId=${state.daoAddress}&tab=proposal&proposalId=${proposalInProgress.id}`}
            style={{ marginTop: "16px" }}
          >
            View DAO Proposal
          </a>
        </Container>
      ) : !props.edit && (registeredProject || state.registrationSuccess) ? (
        <>
          <h1 style={{ textAlign: "center" }}>You've successfully registered!</h1>
          <ButtonsContainer>
            <Button
              {...{
                type: "primary",
                text: "View your project",
                disabled: false,
                href: hrefWithParams(`?tab=project&projectId=${registeredProject?.id || context.accountId}`),
              }}
            />
            <Button
              {...{
                type: "secondary",
                text: "View all projects",
                disabled: false,
                href: hrefWithParams(`?tab=projects`),
              }}
            />
          </ButtonsContainer>
        </>
      ) : (
        <>
          <BannerHeader
            {...{
              projectId: state.isDao && state.daoAddress ? state.daoAddress : context.accountId, // TODO: consider updating to use dao address if available, but will look weird bc no DAOs prob have a banner image on near social
              // allowEdit: true,
              backgroundImage: state.backgroundImage,
              profileImage: state.profileImage,
              bgImageOnChange: (files: any) => {
                if (files) {
                  uploadFileUpdateState(files[0], (res: any) => {
                    const ipfs_cid = res.body.cid;
                    State.update({ backgroundImage: { ipfs_cid } });
                  });
                }
              },
              profileImageOnChange: (files: any) => {
                if (files) {
                  uploadFileUpdateState(files[0], (res: any) => {
                    const ipfs_cid = res.body.cid;
                    State.update({ profileImage: { ipfs_cid } });
                  });
                }
              },
              children: (
                <LowerBannerContainer>
                  <LowerBannerContainerLeft>
                    <AddTeamMembers onClick={() => State.update({ isMultiAccountModalOpen: true })}>
                      {state.teamMembers.length > 0 ? "Add or remove team members" : "Add team members"}
                    </AddTeamMembers>
                  </LowerBannerContainerLeft>
                  <LowerBannerContainerRight>
                    <AccountsStack
                      {...{
                        accountIds: state.teamMembers,
                        sendToBack: state.isMultiAccountModalOpen,
                      }}
                    />
                  </LowerBannerContainerRight>
                </LowerBannerContainer>
              ),
            }}
          />

          <FormBody>
            <FormDivider />
            <FormSectionContainer>
              {FormSectionLeft(
                "Project details",
                "Give an overview of your project including background details and your mission.",
                true,
              )}
              <FormSectionRightDiv>
                <CheckBox
                  {...{
                    id: "masterSelector",
                    checked: state.isDao,
                    onClick: (e: any) => {
                      State.update({ isDao: e.target.checked });
                      if (!e.target.checked && context.accountId) {
                        setSocialData(context.accountId);
                      } else {
                        if (state.daoAddress) {
                          setSocialData(state.daoAddress);
                        }
                      }
                    },
                    label: "Register as DAO",
                    disabled: props.edit,
                    containerStyle: {
                      marginBottom: "24px",
                    },
                  }}
                />
                <Text
                  {...{
                    label: state.isDao ? "DAO address *" : "Project ID *",
                    value: state.isDao ? state.daoAddressTemp : context.accountId,
                    disabled: !state.isDao,
                    onChange: (daoAddress) =>
                      State.update({ daoAddressTemp: daoAddress.toLowerCase(), daoAddressError: "" }),
                    validate: () => {
                      // **CALLED ON BLUR**
                      if (state.isDao) {
                        const isValid = validateNearAddress(state.daoAddressTemp);
                        if (!isValid) {
                          State.update({
                            daoAddressError: "Invalid NEAR account ID",
                          });
                          return;
                        }
                        const NO_PERMISSIONS_ERROR = "You do not have required roles for this DAO";
                        Near.asyncView(state.daoAddressTemp, "get_policy", {})
                          .then((policy) => {
                            // console.log("policy: ", policy);
                            // State.update({ registeredProjects: projects });
                            // Filter the user roles
                            // TODO: break this out (duplicated in Project.Body)
                            const userRoles = policy.roles.filter((role: any) => {
                              if (role.kind === "Everyone") return true;
                              return role.kind.Group && role.kind.Group.includes(context.accountId);
                            });
                            const kind = "call";
                            const action = "AddProposal";
                            // Check if the user is allowed to perform the action
                            const allowed = userRoles.some(({ permissions }: any) => {
                              return (
                                permissions.includes(`${kind}:${action}`) ||
                                permissions.includes(`${kind}:*`) ||
                                permissions.includes(`*:${action}`) ||
                                permissions.includes("*:*")
                              );
                            });
                            if (!allowed) {
                              State.update({
                                daoAddressError: NO_PERMISSIONS_ERROR,
                              });
                            } else {
                              // add all council roles to team (but not current user)
                              const councilRole = policy.roles.find((role: any) => role.name === "council");
                              const councilTeamMembers = councilRole?.kind?.Group || [];
                              State.update({
                                daoAddress: state.daoAddressTemp,
                                teamMembers: councilTeamMembers,
                              });
                            }
                          })
                          .catch((e) => {
                            console.log("error getting DAO policy: ", e);
                            State.update({
                              daoAddressError: NO_PERMISSIONS_ERROR,
                            });
                          });
                        setSocialData(state.daoAddressTemp, false);
                      }
                      State.update({ daoAddressError: "" });
                    },
                    error: state.isDao ? state.daoAddressError : "",
                  }}
                />

                <Space
                  style={{
                    height: "24px",
                  }}
                />
                <Text
                  {...{
                    label: "Project name *",
                    placeholder: "Enter project name",
                    value: state.name,
                    onChange: (name) => State.update({ name }),
                    validate: () => {
                      if (state.name.length < 3) {
                        State.update({ nameError: "Name must be at least 3 characters" });
                        return;
                      }

                      if (state.name.length > 100) {
                        State.update({
                          nameError: "Name must be less than 100 characters",
                        });
                        return;
                      }

                      State.update({ nameError: "" });
                    },
                    error: state.nameError,
                  }}
                />

                <Space
                  style={{
                    height: "24px",
                  }}
                />

                <TextArea
                  {...{
                    label: "Overview *",
                    placeholder: "Give a short description of your project",
                    value: state.description,
                    onChange: (description: string) => State.update({ description }),
                    validate: () => {
                      if (state.description.length > 500) {
                        State.update({
                          descriptionError: "Description must be less than 500 characters",
                        });
                        return;
                      }

                      State.update({ descriptionError: "" });
                    },
                    error: state.descriptionError,
                  }}
                />

                <Space
                  style={{
                    height: "24px",
                  }}
                />

                <TextArea
                  {...{
                    label: "Reason for considering yourself a public good *",
                    placeholder: "Type response",
                    value: state.publicGoodReason,
                    onChange: (publicGoodReason: any) => State.update({ publicGoodReason }),
                    validate: () => {
                      if (state.publicGoodReason.length > 500) {
                        State.update({
                          publicGoodReasonError: "Response must be less than 500 characters",
                        });
                        return;
                      }

                      State.update({ publicGoodReasonError: "" });
                    },
                    error: state.publicGoodReasonError,
                  }}
                />

                <Space
                  style={{
                    height: "24px",
                  }}
                />

                <SelectMultiple
                  {...{
                    label: "Select category (select multiple) *",
                    placeholder: "Choose category",
                    options: Object.values(CATEGORY_MAPPINGS).filter((el) => typeof el === "string"),
                    onChange: (categories) => {
                      State.update({
                        categories,
                      });
                    },
                    selected: state.categories,
                  }}
                />

                <Space
                  style={{
                    height: "24px",
                  }}
                />

                <CheckBox
                  {...{
                    id: "hasSmartContractsSelector",
                    checked: state.hasSmartContracts,
                    onClick: (e: any) => {
                      State.update({ hasSmartContracts: e.target.checked });
                    },
                    label: "Yes, my project has smart contracts",
                    containerStyle: {
                      marginBottom: "16px",
                    },
                  }}
                />
                <CheckBox
                  {...{
                    id: "hasReceivedFundingSelector",
                    checked: state.hasReceivedFunding,
                    onClick: (e: any) => {
                      State.update({ hasReceivedFunding: e.target.checked });
                    },
                    label: "Yes, my project has received funding",
                    // containerStyle: {
                    //   marginBottom: "24px",
                    // },
                  }}
                />
              </FormSectionRightDiv>
            </FormSectionContainer>
            {state.categories.includes(CATEGORY_MAPPINGS.OPEN_SOURCE) && (
              <>
                <FormDivider />
                <FormSectionContainer>
                  {FormSectionLeft(
                    "Add Your Repositories",
                    "Add full URLs for specific github repositories so we can track their popularity.",
                    true,
                  )}
                  <FormSectionRightDiv>
                    {state.githubRepos.map((repo: any, index: any) => {
                      return (
                        <Row style={{ marginBottom: "12px" }} key={index}>
                          <Text
                            {...{
                              label: "GitHub Repo URL #" + (index + 1),
                              // preInputChildren: <InputPrefix>github.com/</InputPrefix>,
                              inputStyles: { borderRadius: "0px 4px 4px 0px" },
                              value: state.githubRepos[index][0],
                              onChange: (repo) =>
                                State.update({
                                  githubRepos: state.githubRepos.map((r: any, i: number) =>
                                    i == index ? [repo] : [r[0]],
                                  ),
                                }),
                              validate: () => {
                                // validate link
                                const isValid = validateGithubRepoUrl(repo);
                                // if invalid, set the error as the 2nd element of the array
                                if (!isValid) {
                                  State.update({
                                    githubRepos: state.githubRepos.map((r: any, i: number) =>
                                      i == index ? [r[0], "Invalid GitHub Repo URL"] : [r[0]],
                                    ),
                                  });
                                  return;
                                }
                              },
                              error: state.githubRepos[index][1] || "",
                            }}
                          />

                          {state.githubRepos.length > 1 && (
                            <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
                              <DeleteIcon
                                onClick={() => {
                                  const updatedRepos = state.githubRepos.filter((r: any, i: number) => i != index);
                                  State.update({
                                    githubRepos: updatedRepos,
                                  });
                                }}
                              />
                            </div>
                          )}
                        </Row>
                      );
                    })}
                    <Button
                      {...{
                        type: "tertiary",
                        text: "Add another repository",
                        disabled: !state.githubRepos[state.githubRepos.length - 1][0],
                        onClick: () => {
                          State.update({
                            githubRepos: [...state.githubRepos, [""]],
                          });
                        },
                      }}
                    />
                  </FormSectionRightDiv>
                </FormSectionContainer>
              </>
            )}
            {state.hasSmartContracts && (
              <>
                <FormDivider />
                <FormSectionContainer>
                  {FormSectionLeft(
                    "Smart contracts",
                    "Add smart contracts from different chains that belong to your application.",
                    true,
                  )}
                  <FormSectionRightDiv>
                    {state.smartContracts.map(([chain, contractAddress]: [string, string], index: number) => {
                      return (
                        <Row style={{ marginBottom: "12px" }} key={index}>
                          <Select
                            {...{
                              label: "Add chain",
                              noLabel: false,
                              placeholder: "Select chain",
                              options: Object.keys(CHAIN_OPTIONS).map((chain) => ({
                                text: chain,
                                value: chain,
                              })),
                              value: {
                                text: chain,
                                value: chain,
                              },
                              onChange: (chain) => {
                                const updatedSmartContracts = state.smartContracts.map((sc: any, i: number) => {
                                  if (i == index) {
                                    return [chain.value, sc[1]];
                                  }
                                  return sc;
                                });
                                State.update({
                                  smartContracts: updatedSmartContracts,
                                });
                              },
                            }}
                          />

                          <Text
                            {...{
                              label: "Contract address",
                              placeholder: "Enter address",
                              value: contractAddress,
                              onChange: (contractAddress) => {
                                const updatedSmartContracts = state.smartContracts.map((sc: any, i: number) => {
                                  if (i == index) {
                                    return [sc[0], contractAddress];
                                  }
                                  return sc;
                                });
                                State.update({
                                  smartContracts: updatedSmartContracts,
                                });
                              },
                              validate: () => {
                                // if NEAR, use validateNearAddress, otherwise if EVM, use validateEvmAddress
                                const chain = state.smartContracts[index][0];
                                const isEvm = CHAIN_OPTIONS[chain].isEVM;
                                const isValid =
                                  chain == "NEAR"
                                    ? validateNearAddress(contractAddress)
                                    : isEvm
                                    ? validateEVMAddress(contractAddress)
                                    : true; // TODO: validate non-EVM, non-NEAR addresses
                                // if invalid, set the error as the 3rd element of the array
                                if (!isValid) {
                                  State.update({
                                    smartContracts: state.smartContracts.map((sc: [string, string], i: number) => {
                                      if (i == index) {
                                        return [sc[0], sc[1], "Invalid address"];
                                      }
                                      return sc;
                                    }),
                                  });
                                  return;
                                }
                              },
                              error: state.smartContracts[index][2] || "",
                            }}
                          />

                          {state.smartContracts.length > 1 && (
                            <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
                              <DeleteIcon
                                onClick={() => {
                                  const updatedSmartContracts = state.smartContracts.filter(
                                    (sc: [string, string], i: number) => i != index,
                                  );
                                  State.update({
                                    smartContracts: updatedSmartContracts,
                                  });
                                }}
                              />
                            </div>
                          )}
                        </Row>
                      );
                    })}

                    <Button
                      {...{
                        type: "tertiary",
                        text: "Add another contract",
                        disabled:
                          !state.smartContracts[state.smartContracts.length - 1][0] &&
                          !state.smartContracts[state.smartContracts.length - 1][1],
                        onClick: () => {
                          State.update({
                            smartContracts: [...state.smartContracts, ["", ""]],
                          });
                        },
                      }}
                    />
                  </FormSectionRightDiv>
                </FormSectionContainer>
              </>
            )}
            {state.hasReceivedFunding && (
              <>
                <FormDivider />
                <FormSectionContainer>
                  {FormSectionLeft("Funding sources", "Add any previous funding you have received.", true)}
                  {/* <FormSectionRightDiv>
                        
                      </FormSectionRightDiv> */}
                </FormSectionContainer>
                {state.fundingSources.length > 0 && (
                  <Table>
                    <div className="header">
                      <div className="item">Funding source</div>
                      <div className="item">Description</div>
                      <div className="item amount">Amount</div>
                      <div className="btns" />
                    </div>
                    {state.fundingSources.map((funding: any, idx: number) => (
                      <div className="fudning-row" key={funding.investorName}>
                        <div className="item source">
                          <div>{funding.investorName}</div>
                          {funding.date && (
                            <div>
                              {new Date(funding.date).toLocaleDateString("en-US", {
                                month: "numeric",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                          )}
                        </div>
                        <div className="item">{funding.description}</div>
                        <div className="item amount">
                          <div>{funding.denomination}</div>
                          <div>{funding.amountReceived}</div>
                        </div>
                        <div className="btns item">
                          {/* Edit Button */}
                          <svg
                            onClick={() =>
                              State.update({
                                fundingSourceIndex: idx,
                              })
                            }
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_446_76)">
                              <path
                                d="M15.369 0.290547C14.979 -0.0994531 14.349 -0.0994531 13.959 0.290547L12.129 2.12055L15.879 5.87055L17.709 4.04055C18.099 3.65055 18.099 3.02055 17.709 2.63055L15.369 0.290547Z"
                                fill="#7B7B7B"
                              />
                              <path
                                d="M-0.000976562 18.0005H3.74902L14.809 6.94055L11.059 3.19055L-0.000976562 14.2505V18.0005ZM1.99902 15.0805L11.059 6.02055L11.979 6.94055L2.91902 16.0005H1.99902V15.0805Z"
                                fill="#7B7B7B"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_446_76">
                                <rect width="18" height="18" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          {/* Delete Button */}
                          <svg
                            onClick={() => {
                              const updatedFundingSources = state.fundingSources.filter(
                                (fudning: any, i: number) => i !== idx,
                              );
                              State.update({
                                fundingSources: updatedFundingSources,
                              });
                            }}
                            width="14"
                            height="18"
                            viewBox="0 0 14 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 6V16H3V6H11ZM9.5 0H4.5L3.5 1H0V3H14V1H10.5L9.5 0ZM13 4H1V16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4Z"
                              fill="#7B7B7B"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </Table>
                )}
                <Button
                  {...{
                    type: "tertiary",
                    text: "Add funding source",
                    style: {
                      width: "fit-content",
                      marginTop: "1rem",
                    },
                    disabled: state.fundingSources.some(
                      (fs: any) => !fs.investorName || !fs.amountReceived || !fs.denomination || !fs.description,
                    ),
                    onClick: () => {
                      // add new funding source obj & set index
                      const updatedFundingSources = [
                        ...state.fundingSources,
                        {
                          investorName: "",
                          description: "",
                          amountReceived: "",
                          denomination: "",
                        },
                      ];
                      State.update({
                        fundingSources: updatedFundingSources,
                        fundingSourceIndex: updatedFundingSources.length - 1,
                      });
                    },
                  }}
                />
              </>
            )}
            <FormDivider />
            <FormSectionContainer>
              {FormSectionLeft(
                "Social links",
                "Add your project social links to so supporters can connect with you directly.",
                false,
              )}
              <FormSectionRightDiv>
                <Text
                  {...{
                    label: "Twitter",
                    preInputChildren: <InputPrefix>twitter.com/</InputPrefix>,
                    inputStyles: { borderRadius: "0px 4px 4px 0px" },
                    value: state.twitter,
                    onChange: (twitter) => State.update({ twitter: twitter.trim() }),
                    validate: () => {
                      if (state.twitter.length > 15) {
                        State.update({
                          twitterError: "Invalid Twitter handle",
                        });
                        return;
                      }
                      State.update({ twitterError: "" });
                    },
                    error: state.twitterError,
                  }}
                />

                <Space
                  style={{
                    height: "24px",
                  }}
                />
                <Text
                  {...{
                    label: "Telegram",
                    preInputChildren: <InputPrefix>t.me/</InputPrefix>,
                    inputStyles: { borderRadius: "0px 4px 4px 0px" },
                    value: state.telegram,
                    onChange: (telegram) => State.update({ telegram: telegram.trim() }),
                    validate: () => {
                      // TODO: add validation?
                    },
                    error: state.telegramError,
                  }}
                />

                <Space
                  style={{
                    height: "24px",
                  }}
                />
                <Text
                  {...{
                    label: "GitHub",
                    preInputChildren: <InputPrefix>github.com/</InputPrefix>,
                    inputStyles: { borderRadius: "0px 4px 4px 0px" },
                    value: state.github,
                    onChange: (github) => State.update({ github: github.trim() }),
                    validate: () => {
                      // TODO: add validation
                    },
                    error: state.githubError,
                  }}
                />

                <Space
                  style={{
                    height: "24px",
                  }}
                />

                <Text
                  {...{
                    label: "Website",
                    preInputChildren: <InputPrefix>https://</InputPrefix>,
                    inputStyles: { borderRadius: "0px 4px 4px 0px" },
                    value: state.website,
                    onChange: (website) => State.update({ website: website.trim() }),
                    validate: () => {
                      // TODO: add validation
                    },
                    error: state.websiteError,
                  }}
                />

                <Space
                  style={{
                    height: "24px",
                  }}
                />

                <Button
                  {...{
                    type: "primary",
                    prefix: "https://",
                    text: props.edit
                      ? state.isDao
                        ? "Add proposal to update project"
                        : "Update your project"
                      : state.isDao
                      ? "Add proposal to create project"
                      : "Create new project",
                    disabled: isCreateProjectDisabled,
                    onClick: handleCreateOrUpdateProject,
                  }}
                />

                <Space
                  style={{
                    height: "24px",
                  }}
                />
              </FormSectionRightDiv>
            </FormSectionContainer>
          </FormBody>
          {state.isMultiAccountModalOpen && (
            <ModalMultiAccount
              {...{
                onClose: () => State.update({ isMultiAccountModalOpen: false }),
                titleText: "Add team members",
                descriptionText: "Add NEAR account IDs for your team members.",
                inputValue: state.teamMember,
                onInputChange: (teamMember: string) => {
                  State.update({ teamMember, nearAccountIdError: "" });
                },
                handleAddAccount: handleAddTeamMember,
                handleRemoveAccount: (accountId: string) => {
                  State.update({
                    teamMembers: state.teamMembers.filter((tm: string) => tm != accountId),
                  });
                },
                accountError: state.nearAccountIdError,
                accountIds: state.teamMembers,
                unitText: "member",
              }}
            />
          )}

          {state.fundingSourceIndex && (
            <ModalAddFundingSource
              {...{
                onClose: () => {
                  // remove any funding sources with all empty values
                  // console.log("state.fundingSources line 1660: ", state.fundingSources);
                  const updatedFundingSources = state.fundingSources.filter(
                    (fs: any) => fs.investorName && fs.amountReceived && fs.denomination && fs.description,
                  );
                  // console.log("updatedFundingSources: ", updatedFundingSources);
                  State.update({
                    fundingSources: updatedFundingSources,
                    fundingSourceIndex: null,
                  });
                },
                fundingSources: state.fundingSources,
                fundingSourceIndex: state.fundingSourceIndex,
                handleAddFundingSource: ({ investorName, date, description, amountReceived, denomination }: any) => {
                  const updatedFundingSources = state.fundingSources.map((fs: any, i: number) => {
                    if (i == state.fundingSourceIndex) {
                      return {
                        investorName,
                        date,
                        description,
                        amountReceived,
                        denomination,
                      };
                    }
                    return fs;
                  });
                  State.update({
                    fundingSources: updatedFundingSources,
                    fundingSourceIndex: null,
                  });
                },
              }}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default CreateForm;
