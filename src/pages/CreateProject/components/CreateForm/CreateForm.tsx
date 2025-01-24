import { Big, Near, State, context, navigate, state, useEffect, useMemo, useParams } from "alem";
import ListsSDK from "@app/SDK/lists";
import DeleteIcon from "@app/assets/svgs/DeleteIcon";
import PlusIcon from "@app/assets/svgs/PlusIcon";
import Button from "@app/components/Button";
import InfoSegment from "@app/components/InfoSegment/InfoSegment";
import Radio from "@app/components/Inputs/Radio/Radio";
import Select from "@app/components/Inputs/Select/Select";
import SelectMultiple from "@app/components/Inputs/SelectMultiple/SelectMultiple";
import Text from "@app/components/Inputs/Text/Text";
import TextArea from "@app/components/Inputs/TextArea/TextArea";
import ModalMultiAccount from "@app/components/ModalMultiAccount/ModalMultiAccount";
import routesPath from "@app/routes/routesPath";
import doesUserHaveDaoFunctionCallProposalPermissions from "@app/utils/doesUserHaveDaoFunctionCallProposalPermissions";
import validateEVMAddress from "@app/utils/validateEVMAddress";
import validateNearAddress from "@app/utils/validateNearAddress";
import { socialFields, CATEGORY_MAPPINGS, CHAIN_OPTIONS, DEFAULT_STATE } from "../../utils/fields";
import handleCreateOrUpdateProject from "../../utils/handleCreateOrUpdateProject";
import { extractRepoPath, isNamedAccount, projectDisabled } from "../../utils/helpers";
import setSocialData from "../../utils/setSocialData";
import AccountsStack from "../AccountsStack/AccountsStack";
import DAOInProgress from "../DAOInProgress/DAOInProgress";
import ModalAddFundingSource from "../ModalAddFundingSource/ModalAddFundingSource";
import Profile from "../Profile/Profile";
import SuccessfullRegister from "../SuccessfullRegister/SuccessfullRegister";
import {
  AddTeamMembers,
  Container,
  FormBody,
  SubTitle,
  InputPrefix,
  LowerBannerContainer,
  LowerBannerContainerLeft,
  LowerBannerContainerRight,
  Row,
  Table,
  Section,
  DAOselect,
  ContractRow,
  BtnWrapper,
} from "./styles";

const CreateForm = (props: { edit: boolean }) => {
  const { projectId: _projectId } = useParams();

  const projectId = _projectId ?? context.accountId;

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

  State.init(DEFAULT_STATE);

  const checkDao = state.isDao && state.daoAddress && !state.daoAddressError;

  const accountId = projectId ? projectId : state.isDao ? state.daoAddress : context.accountId;
  const policy: any = useMemo(() => {
    return checkDao ? Near.view(accountId, "get_policy", {}) : false;
  }, [accountId, checkDao]);

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

  useEffect(() => {
    if (policy) {
      State.update({
        isDao: true,
        daoAddress: projectId,
        daoAddressTemp: projectId,
      });
    }
  }, [policy]);

  const registeredProject = ListsSDK.getRegistration(null, state.isDao ? state.daoAddress : context.accountId);

  const proposals: any = checkDao
    ? Near.view(state.daoAddress, "get_proposals", {
      from_index: 0,
      limit: 1000,
    })
    : null;

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

  const SubHeader = ({ title, requierd }: { title: string; requierd?: boolean }) => (
    <SubTitle>
      {title}
      {requierd ? <span className="required">Required</span> : <span className="optional">Optional</span>}
    </SubTitle>
  );

  return (
    <Container>
      {!state.socialDataFetched ? (
        <div
          className="spinner-border text-secondary"
          style={{
            margin: "auto",
          }}
          role="status"
        />
      ) : proposalInProgress ? (
        <DAOInProgress proposalInProgress={proposalInProgress} />
      ) : !props.edit && (registeredProject || state.registrationSuccess) ? (
        <SuccessfullRegister registeredProject={registeredProject} />
      ) : (
        <>
          <SubHeader title="Upload banner and profile Image" requierd />
          <Profile />
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
          <FormBody>
            {/* PROJECT DETAILS */}
            <Section>
              <SubHeader title="Project details" requierd />
              <DAOselect>
                <div>Would you like to register project as DAO?</div>
                <Radio
                  name="is-dao"
                  value={state.isDao ? "yes" : "no"}
                  onChange={(e) => {
                    const isDao = e.target.value === "yes";

                    State.update({ isDao });
                    if (!isDao && context.accountId) {
                      setSocialData(context.accountId);
                    } else {
                      if (state.daoAddress) {
                        setSocialData(state.daoAddress);
                      }
                    }
                  }}
                  options={[
                    { label: "yes", value: "yes" },
                    { label: "no", value: "no" },
                  ]}
                />
              </DAOselect>
              <Row>
                <Text
                  {...{
                    label: state.isDao ? "DAO address *" : "Project ID *",
                    value: state.isDao ? state.daoAddressTemp : projectId,
                    disabled: !state.isDao,
                    onChange: (daoAddress) =>
                      State.update({ daoAddressTemp: daoAddress.toLowerCase(), daoAddressError: "" }),
                    validate: () => {
                      // **CALLED ON BLUR**

                      if (state.isDao && state.daoAddressTemp) {
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
                            // TODO: break this out (duplicated in Project.Body)
                            if (policy) {
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
                    error: state.isDao
                      ? state.daoAddressError
                      : !isNamedAccount(projectId)
                        ? "Require a name account for proejct registration"
                        : "",
                  }}
                />
              </Row>
              <Row>
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
              </Row>
              <Row>
                <TextArea
                  {...{
                    label: "Describe your project *",
                    placeholder: "Type description",
                    value: state.description,
                    maxCharacters: 500,

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
                {state.categories.includes("Public Good") && (
                  <TextArea
                    {...{
                      label: "Why do you consider yourself a public good? *",
                      placeholder: "Type description",
                      value: state.publicGoodReason,
                      onChange: (publicGoodReason: any) => State.update({ publicGoodReason }),
                      maxCharacters: 500,
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
                )}

              </Row>
            </Section>
            {/* SMART CONTRACT */}
            <Section>
              <SubHeader title="Smart contracts" />
              {state.smartContracts.map(([chain, contractAddress]: [string, string], index: number) => {
                return (
                  <ContractRow key={index}>
                    <Select
                      {...{
                        label: "Add chain",
                        noLabel: false,
                        placeholder: "Select chain",
                        containerStyles: {
                          maxWidth: "180px",
                        },
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
                        containerStyles: {
                          flex: "1",
                          maxWidth: "400px",
                        },
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
                      <Button
                        style={{
                          margin: "auto 0 9px auto",
                        }}
                        type="standard"
                        varient="plain"
                        onClick={() => {
                          const updatedSmartContracts = state.smartContracts.filter(
                            (sc: [string, string], i: number) => i != index,
                          );
                          State.update({
                            smartContracts: updatedSmartContracts,
                          });
                        }}
                      >
                        <DeleteIcon />
                        Remove contract
                      </Button>
                    )}
                  </ContractRow>
                );
              })}

              <Button
                {...{
                  varient: "plain",
                  isDisabled:
                    !state.smartContracts[state.smartContracts.length - 1][0] ||
                    !state.smartContracts[state.smartContracts.length - 1][1] ||
                    state.smartContracts[state.smartContracts.length - 1][2],
                  onClick: () => {
                    State.update({
                      smartContracts: [...state.smartContracts, ["", ""]],
                    });
                  },
                }}
              >
                Add more contract
              </Button>
            </Section>
            {/* FUNDING SOURCE */}
            <Section>
              <SubHeader title="Funding sources" />
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
                  varient: "plain",
                  // style: {
                  //   marginTop: "1.5rem",
                  // },

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
                <PlusIcon /> Add funding source
              </Button>
            </Section>
            {/* REPOSITIORIES */}
            {state.categories.includes("Open Source") && (
              <Section>
                <SubHeader title="Repositories" requierd />
                <Row>
                  {Object.values(state.githubRepos).map((repo: any, index: number) => (
                    <Text
                      {...{
                        preInputChildren: <InputPrefix>github.com/</InputPrefix>,
                        inputContainerStyles: { border: "none" },
                        inputStyles: {
                          borderRadius: "0px 4px 4px 0px",
                          transform: "translateX(-1px)",
                        },
                        value: repo.value,
                        onChange: (value) =>
                          State.update({
                            githubRepos: {
                              ...state.githubRepos,
                              [index]: {
                                value,
                              },
                            },
                          }),
                        validate: () => {
                          // validate link
                          const repoObj = extractRepoPath(repo.value);
                          State.update({
                            githubRepos: {
                              ...state.githubRepos,
                              [index]: repoObj,
                            },
                          });
                        },
                        error: repo.err || "",
                      }}
                    />
                  ))}
                </Row>
                <Button
                  {...{
                    varient: "plain",
                    onClick: () => {
                      State.update({
                        githubRepos: {
                          ...state.githubRepos,
                          [Object.keys(state.githubRepos).length]: {
                            value: "",
                            err: "",
                          },
                        },
                      });
                    },
                  }}
                >
                  <PlusIcon />
                  Add more repo
                </Button>
              </Section>
            )}
            {/* SOCIAL LINKS */}

            <Section>
              <SubHeader title="Social links" />
              <Row>
                {socialFields.map(({ label, error, placeholder }) => (
                  <Text
                    {...{
                      label: label.charAt(0).toUpperCase() + label.slice(1),
                      preInputChildren: <InputPrefix>{placeholder}</InputPrefix>,
                      inputContainerStyles: { border: "none" },
                      inputStyles: {
                        borderRadius: "0px 4px 4px 0px",
                        transform: "translateX(-1px)",
                      },
                      value: state[label],
                      onChange: (value) => State.update({ [label]: value.trim() }),
                      validate: () => {
                        // TODO: add validation
                      },
                      error: state[error],
                    }}
                  />
                ))}
              </Row>
            </Section>
            <Section>
              <BtnWrapper>
                <Button type="standard" varient="outline" onClick={() => navigate.to(routesPath.PROJECTS_LIST_TAB)}>
                  Cancel
                </Button>
                <Button
                  {...{
                    prefix: "https://",
                    type: "standard",
                    varient: "filled",
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
              </BtnWrapper>
            </Section>
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
