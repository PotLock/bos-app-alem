import { ModalBody, ModalFooter, ModalHeader } from "./styles";
import { State, state, useEffect, useParams } from "alem";
import PotSDK from "@app/SDK/pot";
import ModalOverlay from "@app/modals/ModalOverlay";
import TextArea from "@app/components/Inputs/TextArea/TextArea";
import Button from "@app/components/Button";

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
    onClose();
    State.update({ challengeReason: "", challengeReasonError: "" });
  };

  const handleSubmitChallenge = () => {
    PotSDK.challengePayouts(potId, challengeReason);
    onClose();
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
        <Button
          {...{
            type: "tertiary",
            text: "Cancel",
            onClick: handleCancelChallenge,
          }}
        />
        <Button
          {...{
            type: "primary",
            text: "Submit Challenge",
            disabled: !challengeReason || !!challengeReasonError,
            onClick: handleSubmitChallenge,
          }}
        />
      </ModalFooter>
    </ModalOverlay>
  );
};

export default ChallengeModal;
