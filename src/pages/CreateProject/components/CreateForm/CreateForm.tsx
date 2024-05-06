import { Big, Near, State, context, state, useEffect, useMemo, useParams } from "alem";
import ListsSDK from "@app/SDK/lists";
import DeleteIcon from "@app/assets/svgs/DeleteIcon";
import Button from "@app/components/Button";
import InfoSegment from "@app/components/InfoSegment/InfoSegment";
import CheckBox from "@app/components/Inputs/Checkbox/Checkbox";
import Select from "@app/components/Inputs/Select/Select";
import SelectMultiple from "@app/components/Inputs/SelectMultiple/SelectMultiple";
import Text from "@app/components/Inputs/Text/Text";
import TextArea from "@app/components/Inputs/TextArea/TextArea";
import ModalMultiAccount from "@app/components/ModalMultiAccount/ModalMultiAccount";
import BannerHeader from "@app/pages/Profile/components/BannerHeader/BannerHeader";
import doesUserHaveDaoFunctionCallProposalPermissions from "@app/utils/doesUserHaveDaoFunctionCallProposalPermissions";
import hrefWithParams from "@app/utils/hrefWithParams";
import validateEVMAddress from "@app/utils/validateEVMAddress";
import validateGithubRepoUrl from "@app/utils/validateGithubRepoUrl";
import validateNearAddress from "@app/utils/validateNearAddress";
import { CATEGORY_MAPPINGS } from "../../utils/categories";
import { CHAIN_OPTIONS } from "../../utils/chainOptions";
import DEFAULT_STATE from "../../utils/defaultState";
import handleCreateOrUpdateProject from "../../utils/handleCreateOrUpdateProject";
import setSocialData from "../../utils/setSocialData";
import { projectDisabled } from "../../utils/socialData";
import uploadFileUpdateState from "../../utils/uploadFileUpdateState";
import AccountsStack from "../AccountsStack/AccountsStack";
import FormSectionLeft from "../FormSectionLeft/FormSectionLeft";
import ModalAddFundingSource from "../ModalAddFundingSource/ModalAddFundingSource";
import {
  AddTeamMembers,
  ButtonsContainer,
  Container,
  FormBody,
  FormDivider,
  FormSectionContainer,
  FormSectionRightDiv,
  InputPrefix,
  LowerBannerContainer,
  LowerBannerContainerLeft,
  LowerBannerContainerRight,
  Row,
  Space,
  Table,
} from "./styles";

const CreateForm = (props: { edit: boolean }) => {
  const { projectId } = useParams();

  Big.PE = 100;

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

  const registrations = ListsSDK.getRegistrations() || [];

  State.init(DEFAULT_STATE);

  const accountId = projectId ? projectId : state.isDao ? state.daoAddress : context.accountId;
  const policy: any = Near.view(accountId, "get_policy", {});
  const userHasPermissions =
    policy == null
      ? false
      : policy
      ? doesUserHaveDaoFunctionCallProposalPermissions(context.accountId, policy)
      : projectId === context.accountId;

  useEffect(() => {
    if (state.isDao && state.daoAddress) {
      setSocialData(state.daoAddress, true);
    } else if (!state.isDao && context.accountId && !state.socialDataFetched) {
      setSocialData(context.accountId, true);
    }
  }, [state.socialDataFetched, state.isDao, state.daoAddress, context.accountId]);

  const isCreateProjectDisabled = projectDisabled();

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

  if (props.edit && !userHasPermissions) {
    return <h3 style={{ textAlign: "center", paddingTop: "32px" }}>Unauthorized</h3>;
  }

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
                isDisabled: false,
                href: hrefWithParams(`?tab=project&projectId=${registeredProject?.id || context.accountId}`),
              }}
            >
              View your project
            </Button>
            <Button
              {...{
                varient: "tonal",
                isDisabled: false,
                href: hrefWithParams(`?tab=projects`),
              }}
            >
              View all projects
            </Button>
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
                    onClick: () => {
                      State.update({ isDao: !state.isDao });
                      if (!state.isDao && context.accountId) {
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
                                className="delete-icon"
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
                        varient: "outline",
                        isDisabled: !state.githubRepos[state.githubRepos.length - 1][0],
                        onClick: () => {
                          State.update({
                            githubRepos: [...state.githubRepos, [""]],
                          });
                        },
                      }}
                    >
                      Add another repository
                    </Button>
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
                                className="delete-icon"
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
                        varient: "outline",
                        isDisabled:
                          !state.smartContracts[state.smartContracts.length - 1][0] &&
                          !state.smartContracts[state.smartContracts.length - 1][1],
                        onClick: () => {
                          State.update({
                            smartContracts: [...state.smartContracts, ["", ""]],
                          });
                        },
                      }}
                    >
                      Add another contract
                    </Button>
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
                    varient: "outline",
                    style: {
                      width: "fit-content",
                      marginTop: "1rem",
                      marginBottom: "3rem",
                    },
                    isDisabled: state.fundingSources.some(
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
                >
                  Add funding source
                </Button>
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
                    prefix: "https://",
                    isDisabled: isCreateProjectDisabled,
                    onClick: handleCreateOrUpdateProject,
                  }}
                >
                  {props.edit
                    ? state.isDao
                      ? "Add proposal to update project"
                      : "Update your project"
                    : state.isDao
                    ? "Add proposal to create project"
                    : "Create new project"}
                </Button>

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

          {state.fundingSourceIndex !== null && (
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
