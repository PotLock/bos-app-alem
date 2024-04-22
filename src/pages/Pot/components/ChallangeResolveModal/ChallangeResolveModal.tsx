import ModalOverlay from "@app/modals/ModalOverlay";
import { ModalBody, ModalFooter, ModalHeader, HeaderItemText } from "./styles";
import { State, state, useParams } from "alem";
import PotSDK from "@app/SDK/pot";
import TextArea from "@app/components/Inputs/TextArea/TextArea";
import Button from "@app/components/Button";
import CheckBox from "@app/components/Inputs/Checkbox/Checkbox";

const ChallangeResolveModal = ({
  adminModalChallengerId,
  onClose,
}: {
  adminModalChallengerId: string;
  onClose: () => void;
}) => {
  State.init({
    challengeAdminNotes: "",
    challengeAdminNotesError: "",
    resolveChallenge: false,
  });

  const { challengeAdminNotes, challengeAdminNotesError, resolveChallenge } = state;

  const { potId } = useParams();

  const payoutsChallenges = PotSDK.getPayoutsChallenges(potId); // TODO: ADD THIS BACK IN

  const MAX_CHALLENGE_TEXT_LENGTH = 1000;

  const handleAdminUpdateChallenge = () => {
    PotSDK.adminUpdatePayoutsChallenge(potId, adminModalChallengerId, challengeAdminNotes, resolveChallenge);
    State.update({
      challengeAdminNotes: "",
      challengeAdminNotesError: "",
      resolveChallenge: false,
    });
    onClose();
  };

  const handleCancelAdminUpdateChallenge = () => {
    State.update({
      challengeAdminNotes: "",
      challengeAdminNotesError: "",
      resolveChallenge: false,
    });
    onClose();
  };

  return (
    <ModalOverlay onOverlayClick={onClose}>
      <ModalHeader>Update Challenge from {adminModalChallengerId}</ModalHeader>
      <ModalBody>
        <HeaderItemText>Challenge Reason:</HeaderItemText>
        <div>
          {payoutsChallenges.find((challenge: any) => challenge.challenger_id === adminModalChallengerId).reason}
        </div>
        <TextArea
          {...{
            noLabel: true,
            inputRows: 5,
            inputStyle: {
              background: "#FAFAFA",
            },
            placeholder: "Respond to the challenge here",
            value: challengeAdminNotes,
            onChange: (challengeAdminNotes: any) => State.update({ challengeAdminNotes }),
            validate: () => {
              if (challengeAdminNotes.length > MAX_CHALLENGE_TEXT_LENGTH) {
                State.update({
                  challengeAdminNotesError: `Notes must be less than ${MAX_CHALLENGE_TEXT_LENGTH} characters`,
                });
                return;
              }

              State.update({ challengeAdminNotesError: "" });
            },
            error: challengeAdminNotesError,
          }}
        />

        <CheckBox
          {...{
            label: "Resolve this challenge?",
            checked: resolveChallenge,
            onClick: (e: any) => {
              State.update({
                resolveChallenge: e.target.checked,
              });
            },
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          {...{
            type: "tertiary",
            text: "Cancel",
            onClick: handleCancelAdminUpdateChallenge,
          }}
        />
        <Button
          {...{
            type: "primary",
            text: "Submit",
            disabled: !challengeAdminNotes || !!challengeAdminNotesError,
            onClick: handleAdminUpdateChallenge,
          }}
        />
      </ModalFooter>
    </ModalOverlay>
  );
};

export default ChallangeResolveModal;
