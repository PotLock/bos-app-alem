import PotSDK from "@app/SDK/pot";
import { nadabotContractId } from "@app/constants";
import { State, context, state, useParams } from "alem";
import ModalOverlay from "../ModalOverlay";

type Props = {
  projectId?: string;
  onClose: () => void;
  multiple?: boolean;
};

const ModalDonation = (modalProps: Props) => {
  const DENOMINATION_OPTIONS = [{ text: "NEAR", value: "NEAR", decimals: 24 }];

  console.log("Nadabot Contract Id", nadabotContractId);

  const { projectId, onClose, multiple } = modalProps;
  const { potId } = useParams();
  const potDetail = PotSDK.getConfig(potId);

  const DEFAULT_DONATION_AMOUNT = "1";

  const accountId = context.accountId;

  State.init({
    amount: "",
    donationType: multiple ? "auto" : "direct",
    showBreakdown: false,
    bypassProtocolFee: false,
    bypassChefFee: false,
    addNote: false,
    donationNote: "",
    donationNoteError: "",
    allPots: null,
    intervalId: null,
    ftBalances: null,
    selectedDenomination: DENOMINATION_OPTIONS[0],
    denominationOptions: DENOMINATION_OPTIONS,
    selectedRound: "",
    currentPage: multiple ? "formPot" : "form",
    selectedProjects: {},
    toggleAmount: true,
  });

  const {
    amount,
    denomination,
    donationType,
    showBreakdownm,
    bypassProtocolFee,
    bypassChefFee,
    addNote,
    donationNote,
    donationNoteError,
    allPots,
    intervalId,
    nearBalance,
    ftBalances,
    denominationOptions,
    selectedDenomination,
    selectedRound,
    currentPage,
  } = state;

  // TODO: Continuar daqui. Muito complexo!

  return (
    <ModalOverlay>
      <p>oi</p>
    </ModalOverlay>
  );
};

export default ModalDonation;
