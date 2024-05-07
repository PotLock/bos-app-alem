import { State, state, useEffect } from "alem";
import BannerBg from "@app/assets/svgs/banner-bg";
import Button from "@app/components/Button";
import DateInput from "@app/components/Inputs/Date/Date";
import Text from "@app/components/Inputs/Text/Text";
import TextArea from "@app/components/Inputs/TextArea/TextArea";
import ModalOverlay from "@app/modals/ModalOverlay";
import { ModalBody, Banner, Row, HeaderIcons } from "./styles";

type Props = {
  fundingSourceIndex: number;
  fundingSources: any;
  handleAddFundingSource: (fundingSrc: any) => void;
  onClose: () => void;
};

const ModalAddFundingSource = (props: any) => {
  const { onClose, handleAddFundingSource, fundingSources, fundingSourceIndex } = props;

  const initalState = {
    investorName: fundingSources[fundingSourceIndex]?.investorName || "",
    investorNameError: "",
    date: fundingSources[fundingSourceIndex]?.date || "",
    dateError: "",
    description: fundingSources[fundingSourceIndex]?.description || "",
    descriptionError: "",
    denomination: fundingSources[fundingSourceIndex]?.denomination || "",
    denominationError: "",
    amountReceived: fundingSources[fundingSourceIndex]?.amountReceived || "",
    amountReceivedError: "",
  };

  State.init(initalState);

  useEffect(() => {
    State.update(initalState);
  }, [fundingSources, fundingSourceIndex]);

  const isDisabled =
    !state.investorName ||
    !!state.investorNameError ||
    !!state.dateError ||
    !state.description ||
    !!state.descriptionError ||
    !state.denomination ||
    !!state.denominationError ||
    !state.amountReceived ||
    !!state.amountReceivedError;

  const handleAddingSrc = () => {
    const fundingSource = {
      investorName: state.investorName,
      date: state.date,
      description: state.description,
      denomination: state.denomination,
      amountReceived: state.amountReceived,
    };
    State.update({
      investorName: "",
      investorNameError: "",
      date: "",
      dateError: "",
      description: "",
      descriptionError: "",
      denomination: "",
      denominationError: "",
      amountReceived: "",
      amountReceivedError: "",
    });
    handleAddFundingSource(fundingSource);
  };

  return (
    <ModalOverlay overlayStyle={onClose} contentStyle={{ padding: "0px" }}>
      <Banner>
        <BannerBg className="left-pattern" />
        <BannerBg className="right-pattern" />
        <HeaderIcons>
          <svg
            onClick={onClose}
            className="close-icon"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
              fill="#FCCFCF"
            />
          </svg>
        </HeaderIcons>
        <div>Add Funding source</div>
      </Banner>

      <ModalBody>
        <Text
          {...{
            label: "Name of investor",
            placeholder: "Enter investor name",
            value: state.investorName,
            onChange: (val) => State.update({ investorName: val }),
            validate: () => {
              if (state.investorName.length < 3) {
                State.update({ investorNameError: "Must be at least 3 characters" });
                return;
              }
              if (state.investorName.length > 50) {
                State.update({ investorNameError: "Must be less than 50 characters" });
                return;
              }
              State.update({ investorNameError: "" });
            },
            error: state.investorNameError,
          }}
        />
        <DateInput
          {...{
            label: (
              <>
                Date <span>(optional)</span>
              </>
            ),

            //   placeholder: "0", // TODO: possibly add this back in
            selectTime: false,
            value: state.date,
            onChange: (date) => State.update({ date: date }),
            error: state.dateError,
          }}
        />
        <TextArea
          {...{
            label: "Description",
            placeholder: "Type description",
            value: state.description,
            onChange: (description: string) => State.update({ description }),
            validate: () => {
              if (state.description.length > 500) {
                State.update({ descriptionError: "Must be less than 500 characters" });
                return;
              }
              State.update({ descriptionError: "" });
            },
            error: state.descriptionError,
          }}
        />
        <Text
          {...{
            label: "Denomination of investment",
            placeholder: "e.g. NEAR, USD, USDC, etc.",
            value: state.denomination,
            onChange: (val) => State.update({ denomination: val.toUpperCase() }),
            validate: () => {
              if (state.denomination.length < 3) {
                State.update({ denominationError: "Must be at least 3 characters" });
                return;
              }
              if (state.denomination.length > 10) {
                State.update({ denominationError: "Must be less than 10 characters" });
                return;
              }
              State.update({ denominationError: "" });
            },
            error: state.denominationError,
          }}
        />

        <Text
          {...{
            label: "Investment amount",
            placeholder: "e.g. 1000",
            value: state.amountReceived,
            onChange: (val) => State.update({ amountReceived: val }),
            validate: () => {
              // TODO: VALIDATE AMOUNT
              if (isNaN(state.amountReceived)) {
                State.update({ amountReceivedError: "Must be a number" });
                return;
              }
              State.update({ amountReceivedError: "" });
            },
            error: state.amountReceivedError,
          }}
        />

        <Row style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button isDisabled={isDisabled} onClick={handleAddingSrc}>
            Add Funding Source
          </Button>
        </Row>
      </ModalBody>
    </ModalOverlay>
  );
};

export default ModalAddFundingSource;
