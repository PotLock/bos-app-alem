import { Near, State, state, useParams } from "alem";
import Button from "@app/components/Button";
import TextArea from "@app/components/Inputs/TextArea/TextArea";
import constants from "@app/constants";
import ModalOverlay from "@app/modals/ModalOverlay";
import { ModalBody, ModalFooter, ModalHeader } from "./styles";

const ApplicationReviewModal = ({
  projectId,
  onClose,
  newStatus,
}: {
  projectId: string;
  newStatus: string;
  onClose: () => void;
}) => {
  State.init({
    reviewMessage: "",
    reviewMessageError: "",
  });

  const { reviewMessage, reviewMessageError } = state;

  const { potId } = useParams();

  const {
    ONE_TGAS,
    SUPPORTED_FTS: { NEAR },
  } = constants;

  const MAX_APPLICATION_MESSAGE_LENGTH = 1000;

  const handleCancel = () => {
    State.update({ reviewMessage: "", reviewMessageError: "" });
    onClose();
  };

  const handleSubmit = () => {
    const args = {
      project_id: projectId,
      status: newStatus,
      notes: reviewMessage,
    };
    const transactions = [
      {
        contractName: potId,
        methodName: "chef_set_application_status",
        deposit: NEAR.toIndivisible(0.01),
        args,
        gas: ONE_TGAS.mul(100),
      },
    ];
    Near.call(transactions);
    // NB: we won't get here if user used a web wallet, as it will redirect to the wallet
    // <---- TODO: IMPLEMENT EXTENSION WALLET HANDLING ---->
  };

  return (
    <ModalOverlay>
      <ModalHeader>
        {newStatus === "Approved" ? "Approve " : newStatus === "Rejected" ? "Reject " : ""}
        application from {projectId}
      </ModalHeader>
      <ModalBody>
        <div>Leave a note *</div>
        <TextArea
          {...{
            noLabel: true,
            inputRows: 5,
            inputStyle: {
              background: "#FAFAFA",
            },
            placeholder: "Type notes here",
            value: reviewMessage,
            onChange: (reviewMessage: string) => State.update({ reviewMessage }),
            validate: () => {
              if (reviewMessage.length > MAX_APPLICATION_MESSAGE_LENGTH) {
                State.update({
                  reviewMessageError: `Application message must be less than ${MAX_APPLICATION_MESSAGE_LENGTH} characters`,
                });
                return;
              }

              State.update({ reviewMessageError: "" });
            },
            error: reviewMessageError,
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleCancel} varient="outline">
          Cancel
        </Button>
        <Button isDisabled={!reviewMessage || !!reviewMessageError} onClick={handleSubmit}>
          Submit
        </Button>
      </ModalFooter>
    </ModalOverlay>
  );
};

export default ApplicationReviewModal;
