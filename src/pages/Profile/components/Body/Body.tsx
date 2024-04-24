import { Near, context, props, useState, useParams, useMemo } from "alem";
import { Container, Details, ModalTitle, Row, Wrapper } from "./styles";
import constants from "@app/constants";
import BannerHeader from "../BannerHeader/BannerHeader";
import BodyHeader from "../BodyHeader/BodyHeader";
import Select from "../../../../components/Inputs/Select/Select";
import Tabs from "../Tabs";
import ListsSDK from "@app/SDK/lists";
import ModalOverlay from "@app/modals/ModalOverlay";
import TextArea from "@app/components/Inputs/TextArea/TextArea";
import Button from "@app/components/Button";

// type Props = {
//   projectId?: string;
//   project?: Project;
//   profile: any;
//   nav: string;
//   navOptions: any;
// };

const Body = (props: any) => {
  const { projectId } = props;
  const { accountId: _accountId } = useParams();
  const accountId = _accountId ?? context.accountId;
  const {
    PROJECT_STATUSES,
    SUPPORTED_FTS: { NEAR },
  } = constants;

  const [statusReview, setStatusReview] = useState({ modalOpen: false, notes: "", newStatus: "" });

  const listsContractId = ListsSDK.getContractId();
  const userIsRegistryAdmin = ListsSDK.isRegistryAdmin(context.accountId);
  const registration = ListsSDK.getRegistration(null, projectId);

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
  };

  const SelectedNavComponent = useMemo(() => {
    return props.navOptions.find((option: any) => option.id == props.nav).source;
  }, []);

  return (
    <Wrapper>
      <BannerHeader showFollowers accountId={projectId || accountId} projectId={projectId} project={props.project} />
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
              value: { text: props.registration.status, value: props.registration.status },
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
              <Button type="primary" text="Submit" onClick={handleUpdateStatus} />
            </Row>
          </>
        </ModalOverlay>
      )}
    </Wrapper>
  );
};

export default Body;
