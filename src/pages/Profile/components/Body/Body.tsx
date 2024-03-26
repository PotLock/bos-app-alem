import { Near, Widget, context, props, useState } from "alem";
import { Container, Details, ModalTitle, Row, Wrapper } from "./styles";
import { PROJECT_STATUSES, SUPPORTED_FTS, ownerId } from "../../../../constants";
import RegistrySDK from "../../../../SDK/registry";
import BannerHeader from "../BannerHeader/BannerHeader";
import { Project } from "../../../../types";
import BodyHeader from "../BodyHeader/BodyHeader";
import Select from "../../../../components/Inputs/Select/Select";
import Tabs from "../Tabs";

type Props = {
  projectId: string;
  project: Project;
  profile: any;
  nav: string;
  navOptions: any;
};

const Body = ({ projectId, project, profile, nav, navOptions }: Props) => {
  const accountId = props.accountId ?? context.accountId;

  const [statusReview, setStatusReview] = useState({ modalOpen: false, notes: "", newStatus: "" });

  const registryContractId = RegistrySDK.getContractId();
  const userIsRegistryAdmin = RegistrySDK.isUserRegistryAdmin(context.accountId);

  const handleUpdateStatus = () => {
    Near.call([
      {
        contractName: registryContractId,
        methodName: "admin_set_project_status",
        args: {
          project_id: projectId,
          status: statusReview.newStatus,
          review_notes: statusReview.notes,
        },
        deposit: SUPPORTED_FTS.NEAR.toIndivisible(0.01).toString(),
      },
    ]);
  };

  // Select props
  const options = PROJECT_STATUSES.map((status) => ({
    value: status,
    text: status,
  }));

  const value = { text: props.project.status, value: props.project.status };

  const onChangeHandler = (status: any) => {
    if (status.value != project.status) {
      setStatusReview({ ...statusReview, newStatus: status.value, modalOpen: true });
    }
  };

  // TODO: Use SimpleRoute instead
  const SelectedNavComponent = navOptions.find((option: any) => option.id == nav).source;

  return (
    <Wrapper>
      <BannerHeader showFollowers accountId={projectId || accountId} projectId={projectId} project={project} />

      <Container>
        <BodyHeader accountId={accountId} projectId={projectId} profile={profile} />
        {userIsRegistryAdmin && projectId && (
          <Select
            noLabel
            options={options}
            value={value}
            onChange={onChangeHandler}
            containerStyles={{ padding: "16px 24px" }}
          />
        )}
        <Tabs navOptions={navOptions} nav={nav} />

        <Details>
          {/* Selected Nav Page / Component */}
          <SelectedNavComponent accountId={accountId} projectId={projectId} />
        </Details>
      </Container>

      {/* <Widget
        src={`${ownerId}/widget/Components.Modal`}
        props={{
          ...props,
          isModalOpen: statusReview.modalOpen,
          onClose: () => setStatusReview({ ...statusReview, modalOpen: false }),
          children: (
            <>
              <ModalTitle>Enter Notes for changing status to {statusReview.newStatus}</ModalTitle>
              <Widget
                src={`${ownerId}/widget/Inputs.TextArea`}
                props={{
                  noLabel: true,
                  inputRows: 5,
                  inputStyle: {
                    background: "#FAFAFA",
                  },
                  placeholder: "Your notes here...",
                  value: statusReview.notes,
                  onChange: (notes) => setStatusReview({ ...statusReview, notes }),
                  validate: () => {
                    // none necessary
                  },
                }}
              />
              <Row style={{ justifyContent: "flex-end", marginTop: "12px" }}>
                <Widget
                  src={`${ownerId}/widget/Components.Button`}
                  props={{
                    type: "primary",
                    text: "Submit",
                    onClick: handleUpdateStatus,
                  }}
                />
              </Row>
            </>
          ),
        }}
      /> */}
    </Wrapper>
  );
};

export default Body;
