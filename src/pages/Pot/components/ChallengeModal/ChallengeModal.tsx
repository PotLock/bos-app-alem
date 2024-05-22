import { State, state, useEffect, useParams } from "alem";
import PotSDK from "@app/SDK/pot";
import Button from "@app/components/Button";
import TextArea from "@app/components/Inputs/TextArea/TextArea";
import ModalOverlay from "@app/modals/ModalOverlay";
import { ModalBody, ModalFooter, ModalHeader } from "./styles";

const ChallengeModal = ({ onClose, existingChallengeForUser }: any) => {
  const { potId } = useParams();

  State.init({
    challengeReason: "",
    challengeReasonError: "",
  });

  useEffect(() => {
    if (existingChallengeForUser?.reason) {
      State.update({
        challengeReason: existingChallengeForUser?.reason,
      });
    }
  }, [existingChallengeForUser]);

  const { challengeReason, challengeReasonError } = state;

  const handleCancelChallenge = () => {
    State.update({ challengeReason: "", challengeReasonError: "" });
    onClose();
  };

  const handleSubmitChallenge = () => {
    PotSDK.challengePayouts(potId, challengeReason);
  };

  const MAX_CHALLENGE_TEXT_LENGTH = 1000;

  return (
    <ModalOverlay onOverlayClick={onClose}>
      <ModalHeader>Challenge Payouts</ModalHeader>
      <ModalBody>
        <div>Explain the reason for your challenge</div>
        <TextArea
          {...{
            noLabel: true,
            inputRows: 5,
            inputStyle: {
              background: "#FAFAFA",
            },
            placeholder: "Type the reason for your challenge here",
            value: challengeReason,
            onChange: (challengeReason: any) => State.update({ challengeReason }),
            validate: () => {
              if (challengeReason.length > MAX_CHALLENGE_TEXT_LENGTH) {
                State.update({
                  challengeReasonError: `Challenge reason must be less than ${MAX_CHALLENGE_TEXT_LENGTH} characters`,
                });
                return;
              }

              State.update({ challengeReasonError: "" });
            },
            error: challengeReasonError,
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button varient="outline" onClick={handleCancelChallenge}>
          Cancel
        </Button>
        <Button isDisabled={!challengeReason || !!challengeReasonError} onClick={handleSubmitChallenge}>
          Submit Challenge
        </Button>
      </ModalFooter>
    </ModalOverlay>
  );
};

export default ChallengeModal;
