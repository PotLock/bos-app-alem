import { Near, State, state, useParams } from "alem";
import PotSDK from "@app/SDK/pot";
import Button from "@app/components/Button";
import TextArea from "@app/components/Inputs/TextArea/TextArea";
import constants from "@app/constants";
import { useToastNotification } from "@app/hooks/useToast";
import ModalOverlay from "@app/modals/ModalOverlay";
import { PotApplication } from "@app/types";
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

  const { toast } = useToastNotification();

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

  const handleSuccess = () => {
    const applicationSuccess = setInterval(() => {
      PotSDK.asyncGetApplicationByProjectId(potId, projectId).then((application: PotApplication) => {
        if (application.status === newStatus) {
          toast({
            title: "Updated Successfully!",
            description: `Application has been successfully updated to ${newStatus}.`,
          });
        }
      });
    }, 1000);
    // Clear the interval after 60 seconds
    setTimeout(() => {
      onClose();
      clearInterval(applicationSuccess);
    }, 60000);
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
    handleSuccess();
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
