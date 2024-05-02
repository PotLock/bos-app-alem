import { Near } from "alem";
import { CustomButton, CurrentBalance, Form, Label, PotWrapper, Button } from "./styles";
import constants from "@app/constants";
import PotSDK from "@app/SDK/pot";
import Loading from "@app/components/Loading";
import Checks from "../Checks/Checks";
import SelectPot from "../SelectPot";
import AmountInput from "../AmountInput/AmountInput";
import Alert from "../Banners/Alert";
import Nadabot from "../Banners/Nadabot";
import VerifyInfo from "../Banners/VerifyInfo";
import { useCart } from "@app/hooks/useCart";

const FormDirect = (props: any) => {
  const {
    projectId,
    profile,
    amount,
    amountError,
    denominationOptions,
    updateState,
    selectedDenomination,
    donationType,
    ftBalance,
    activeRounds,
    accountId,
    selectedRound,
  } = props;

  const { NADABOT_HUMAN_METHOD, NADABOT_CONTRACT_ID } = constants;

  const { addItemstoCart } = useCart();

  const isUserHumanVerified = Near.view(NADABOT_CONTRACT_ID, NADABOT_HUMAN_METHOD, {
    account_id: accountId,
  });

  const needsToVerify = isUserHumanVerified === false && donationType === "pot";

  const donationTypes = [
    {
      label: "Direct donation",
      val: "direct",
      disabled: false,
    },
    {
      label: "Quadratically matched donation",
      val: "pot",
      disabled: !activeRounds || activeRounds.length === 0,
      disabledText: "(no pots available)",
    },
  ];

  const activeRoundsOptions: any = {};

  (activeRounds || []).forEach((round: any) => {
    activeRoundsOptions[round] = {
      label: PotSDK.getConfig(round)?.pot_name || round,
      val: round,
    };
  });

  const isFtDonation = selectedDenomination.text !== "NEAR";

  const HandleAmoutChange = (amount: any) => {
    amount = amount.replace(/[^0-9.]+/g, ""); // remove all non-numeric characters except for decimal
    if (amount === ".") amount = "0.";
    updateState({ amount, amountError: "" });
    // error if amount is greater than balance
    if (amount > ftBalance && ftBalance !== null) {
      updateState({ amountError: "You don’t have enough balance to complete this transaction." });
    } else if (!isFtDonation && parseFloat(amount) < 0.1) {
      updateState({ amountError: "Minimum donation is 0.1 NEAR" });
    }
  };

  const isLoading = donationType === "pot" ? isUserHumanVerified === null || activeRounds === null : false;

  const isDisabled = amountError || !amount || !accountId;

  return projectId ? (
    profile === null ? (
      <Loading />
    ) : (
      <Form>
        <Label>How do you want to donate?</Label>
        <Checks
          options={donationTypes}
          value={donationType}
          onClick={(val: any) =>
            updateState({
              donationType: val,
            })
          }
        />
        {donationType === "pot" && (
          <PotWrapper>
            <Label>Select Pot</Label>
            <SelectPot {...props} activeRoundsOptions={activeRoundsOptions} />
          </PotWrapper>
        )}
        <Label
          style={{
            marginTop: "1.5rem",
          }}
        >
          Amount
        </Label>
        <AmountInput
          value={amount}
          donationType={donationType}
          HandleAmoutChange={HandleAmoutChange}
          updateState={updateState}
          denominationOptions={denominationOptions}
          selectedDenomination={selectedDenomination}
        />

        {ftBalance && (
          <CurrentBalance>
            <div className="balance">
              <div>
                {ftBalance} <span> {selectedDenomination.text} </span>
              </div>
              <div>available</div>
            </div>
          </CurrentBalance>
        )}
        {amountError && <Alert error={amountError} />}
        {needsToVerify && <VerifyInfo />}
        <CustomButton>
          <Button
            {...{
              className: `filled ${isDisabled ? "disabled" : ""}`,
              onClick: () => updateState({ currentPage: "confirm" }),
            }}
          >
            {" "}
            {!accountId ? "Sign In to Proceed" : isLoading ? "Loading..." : "Proceed to donate"}{" "}
          </Button>
          <Button
            {...{
              className: `outline ${isDisabled ? "disabled" : ""}`,
              onClick: () =>
                addItemstoCart([
                  {
                    id: projectId,
                    amount,
                    token: selectedDenomination,
                    potId: selectedRound,
                  },
                ]),
            }}
          >
            Add to cart
          </Button>
        </CustomButton>
      </Form>
    )
  ) : (
    ""
  );
};

export default FormDirect;
