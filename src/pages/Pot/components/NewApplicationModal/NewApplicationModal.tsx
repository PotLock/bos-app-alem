import ModalOverlay from "@app/modals/ModalOverlay";
import { ModalTitle, Row } from "./styles";
import TextArea from "@app/components/Inputs/TextArea/TextArea";
import CheckBox from "@app/components/Inputs/Checkbox/Checkbox";
import Button from "@app/components/Button";
import hrefWithParams from "@app/utils/hrefWithParams";
import Text from "@app/components/Inputs/Text/Text";
import { State, state, context, Near, useEffect, useParams } from "alem";
import doesUserHaveDaoFunctionCallProposalPermissions from "@app/utils/doesUserHaveDaoFunctionCallProposalPermissions";
import handleSendApplication from "../../utils/handleSendApplication";

const NewApplicationModal = ({
  potDetail,
  onClose,
  setIsDao,
  isDao,
  setApplicationSuccess,
  setRegistryStatus,
  registryStatus,
}: any) => {
  const MAX_APPLICATION_MESSAGE_LENGTH = 1000;

  State.init({
    applicationMessage: "",
    applicationMessageError: "",
    daoAddress: "",
    daoPolicy: "",
    daoAddressError: "",
  });
  const updateState = State.update;

  const { applicationMessage, applicationMessageError, daoAddress, daoAddressError } = state;

  const accountId = context.accountId || "";

  const { potId } = useParams();

  const verifyIsOnRegistry = (address: string) => {
    Near.asyncView("lists.potlock.near", "get_registrations_for_registrant", {
      registrant_id: address,
    }).then((registrations) => {
      const registration = registrations.find(
        (registration: any) => registration.list_id === 1, // potlock registry list id
      );
      if (registration) {
        setRegistryStatus(registration.status);
      }
    });
  };

  useEffect(() => {
    if (!state.isDao) {
      verifyIsOnRegistry(context.accountId || "");
    }
  }, []);

  const textAreaProps = {
    noLabel: true,
    inputRows: 5,
    inputStyle: {
      background: "#FAFAFA",
    },
    placeholder: "Your application message here...",
    value: applicationMessage,
    onChange: (applicationMessage: string) => updateState({ applicationMessage }),
    validate: () => {
      if (applicationMessage.length > MAX_APPLICATION_MESSAGE_LENGTH) {
        updateState({
          applicationMessageError: `Application message must be less than ${MAX_APPLICATION_MESSAGE_LENGTH} characters`,
        });
        return;
      }

      updateState({ applicationMessageError: "" });
    },
    error: applicationMessageError,
  };

  const checkBoxProps = {
    id: "isDaoSelector",
    checked: isDao,
    onClick: (e: any) => {
      setIsDao(e.target.checked);
      if (!e.target.checked) {
        // check current account ID against registry
        verifyIsOnRegistry(accountId || "");
      }
    },
    label: "I'm applying as a DAO",
  };

  const textProps = {
    label: "DAO address *",
    placeholder: "E.g. mydao.sputnikdao.near",
    value: daoAddress,
    onChange: (daoAddress: string) => updateState({ daoAddress, daoAddressError: "" }),
    validate: () => {
      // **CALLED ON BLUR**
      Near.asyncView(daoAddress, "get_policy", {})
        .then((policy) => {
          const hasPermissions = !policy ? false : doesUserHaveDaoFunctionCallProposalPermissions(accountId, policy);

          updateState({
            daoAddressError: hasPermissions
              ? ""
              : "You don't have required permissions to submit proposals to this DAO.",
            daoPolicy: policy,
          });
          // check registry
          verifyIsOnRegistry(daoAddress);
        })
        .catch((e) => {
          updateState({
            daoAddressError: "Invalid DAO address",
          });
        });
    },
    error: daoAddressError,
  };

  const isError = applicationMessageError || daoAddressError;

  const registrationApproved = registryStatus === "Approved";

  const registrationApprovedOrNoRegistryProvider = registrationApproved || !potDetail?.registry_provider;

  return (
    <ModalOverlay onOverlayClick={onClose}>
      <ModalTitle>
        Application message <span style={{ color: "#DD3345" }}>*</span>
      </ModalTitle>
      <TextArea {...textAreaProps} />

      <Row style={{ margin: "12px 0px" }}>
        <CheckBox {...checkBoxProps} />
      </Row>
      {isDao && <Text {...textProps} />}
      <Row style={{ justifyContent: "flex-end", marginTop: "12px" }}>
        <Button
          type="primary"
          text={
            isDao
              ? "Propose to Send Application"
              : registrationApprovedOrNoRegistryProvider
              ? "Send application"
              : "Register to apply"
          }
          onClick={
            (isDao || registrationApprovedOrNoRegistryProvider) && !isError
              ? () => {
                  handleSendApplication(potId, potDetail, setApplicationSuccess, isDao);
                }
              : () => {}
          }
          disabled={isError}
          href={isDao || registrationApprovedOrNoRegistryProvider ? "" : hrefWithParams(`?tab=createproject`)}
          target={isDao || registrationApprovedOrNoRegistryProvider ? "_self" : "_blank"}
        />
      </Row>
    </ModalOverlay>
  );
};

export default NewApplicationModal;
