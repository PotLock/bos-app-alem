import { Near, context, props, useState, useParams, useMemo, useEffect } from "alem";
import ListsSDK from "@app/SDK/lists";
import Button from "@app/components/Button";
import TextArea from "@app/components/Inputs/TextArea/TextArea";
import getToastContainer from "@app/components/ToastNotification/getToastContainer";
import constants from "@app/constants";
import { useToastNotification } from "@app/hooks/useToast";
import ModalOverlay from "@app/modals/ModalOverlay";
import { Registration, RegistrationStatus } from "@app/types";
import getTransactionsFromHashes from "@app/utils/getTransactionsFromHashes";
import Select from "../../../../components/Inputs/Select/Select";
import BannerHeader from "../BannerHeader/BannerHeader";
import BodyHeader from "../BodyHeader/BodyHeader";
import Tabs from "../Tabs";
import { Container, Details, ModalTitle, Row, Wrapper } from "./styles";

// type Props = {
//   projectId?: string;
//   project?: Project;
//   profile: any;
//   nav: string;
//   navOptions: any;
// };

const Body = (props: any) => {
  const { projectId } = props;
  const { accountId: _accountId, transactionHashes } = useParams();

  const registration = ListsSDK.getRegistration(null, projectId);

  const accountId = _accountId ?? context.accountId;
  const {
    PROJECT_STATUSES,
    SUPPORTED_FTS: { NEAR },
  } = constants;

  const [statusReview, setStatusReview] = useState({ modalOpen: false, notes: "", newStatus: "" });

  const ToastNotification = getToastContainer();

  const { toast } = useToastNotification();

  const listsContractId = ListsSDK.getContractId();
  const userIsRegistryAdmin = ListsSDK.isRegistryAdmin(context.accountId);

  const statusToast = (status: RegistrationStatus) =>
    toast({
      title: "Updated Successfully!",
      description: `Project has been successfully updated to ${status.toLowerCase()}.`,
    });

  const handleUpdateStatus = () => {
    Near.call([
      {
        contractName: listsContractId,
        methodName: "update_registration",
        args: {
          registration_id: registration.id,
          status: statusReview.newStatus,
          notes: statusReview.notes,
        },
        deposit: NEAR.toIndivisible(0.01).toString(),
      },
    ]);

    // success update project notification
    const updateProjectSuccess = setInterval(() => {
      ListsSDK.asyncGetRegistration(null, projectId).then((registration: Registration) => {
        if (registration.status === statusReview.newStatus) {
          statusToast(registration.status);
        }
      });
    }, 1000);

    // Clear the interval after 60 seconds
    setTimeout(() => {
      clearInterval(updateProjectSuccess);
    }, 60000);
  };

  // Handle update project status for web wallet
  useEffect(() => {
    if (accountId && transactionHashes) {
      getTransactionsFromHashes(transactionHashes, "plugrel.near").then((trxs) => {
        const transaction = trxs[0].body.result.transaction;
        const methodName = transaction.actions[0].FunctionCall.method_name;
        const successVal = trxs[0].body.result.status?.SuccessValue;
        const result = JSON.parse(Buffer.from(successVal, "base64").toString("utf-8"));
        if (methodName === "update_registration" && result) {
          statusToast(result.status);
        }
      });
    }
  }, []);

  const SelectedNavComponent = useMemo(() => {
    return props.navOptions.find((option: any) => option.id == props.nav).source;
  }, []);

  return (
    <Wrapper>
      <BannerHeader
        showFollowers
        accountId={projectId || accountId}
        projectId={projectId}
        registration={registration}
      />
      <Container>
        <BodyHeader accountId={accountId} projectId={projectId} profile={props.profile} />
        {userIsRegistryAdmin && projectId && (
          <Select
            {...{
              noLabel: true,
              options: PROJECT_STATUSES.map((status) => ({
                value: status,
                text: status,
              })),
              value: { text: registration.status, value: registration.status },
              onChange: (status) => {
                if (status.value != registration.status) {
                  setStatusReview({ ...statusReview, newStatus: status.value, modalOpen: true });
                }
              },
              containerStyles: {
                padding: "16px 24px",
              },
            }}
          />
        )}
        <Tabs navOptions={props.navOptions} nav={props.nav} />

        <Details>
          {SelectedNavComponent && (
            <SelectedNavComponent
              accountId={accountId}
              projectId={projectId}
              accounts={[projectId || accountId]}
              donations={props.donations}
              {...props}
            />
          )}
        </Details>
      </Container>

      {statusReview.modalOpen && (
        <ModalOverlay onOverlayClick={() => setStatusReview({ ...statusReview, modalOpen: false })}>
          <>
            <ModalTitle>Enter Notes for changing status to {statusReview.newStatus}</ModalTitle>
            <TextArea
              {...{
                noLabel: true,
                inputRows: 5,
                inputStyle: {
                  background: "#FAFAFA",
                },
                placeholder: "Your notes here...",
                value: statusReview.notes,
                onChange: (notes: any) => setStatusReview({ ...statusReview, notes }),
                validate: () => {
                  // none necessary
                },
              }}
            />
            <Row style={{ justifyContent: "flex-end", marginTop: "12px" }}>
              <Button onClick={handleUpdateStatus}>Submit</Button>
            </Row>
          </>
        </ModalOverlay>
      )}
      <ToastNotification />
    </Wrapper>
  );
};

export default Body;
