import { State, state, useEffect } from "alem";
import { CloseIcon, Icon, ModalBody, ModalHeader, ModalHeaderText, Row } from "./styles";
import ModalOverlay from "@app/modals/ModalOverlay";
import Text from "@app/components/Inputs/Text/Text";
import DateInput from "@app/components/Inputs/Date/Date";
import TextArea from "@app/components/Inputs/TextArea/TextArea";
import Button from "@app/components/Button";

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

  return (
    <ModalOverlay overlayStyle={onClose}>
      <ModalHeader>
        <div></div>
        <Row>
          <Icon width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.39016 7.9C4.12016 7.31 3.39016 6.7 3.39016 5.75C3.39016 4.66 4.40016 3.9 6.09016 3.9C7.87016 3.9 8.53016 4.75 8.59016 6H10.8002C10.7302 4.28 9.68016 2.7 7.59016 2.19V0H4.59016V2.16C2.65016 2.58 1.09016 3.84 1.09016 5.77C1.09016 8.08 3.00016 9.23 5.79016 9.9C8.29016 10.5 8.79016 11.38 8.79016 12.31C8.79016 13 8.30016 14.1 6.09016 14.1C4.03016 14.1 3.22016 13.18 3.11016 12H0.910156C1.03016 14.19 2.67016 15.42 4.59016 15.83V18H7.59016V15.85C9.54016 15.48 11.0902 14.35 11.0902 12.3C11.0902 9.46 8.66016 8.49 6.39016 7.9Z"
              fill="#151A23"
            />
          </Icon>

          <ModalHeaderText>Add Past Funding Source</ModalHeaderText>
        </Row>
        <CloseIcon viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClose}>
          <path
            d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
            fill="#7B7B7B"
          />
        </CloseIcon>
      </ModalHeader>
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
          <Button
            {...{
              type: "primary",
              text: "Add Funding Source",
              disabled:
                !state.investorName ||
                !!state.investorNameError ||
                !!state.dateError ||
                !state.description ||
                !!state.descriptionError ||
                !state.denomination ||
                !!state.denominationError ||
                !state.amountReceived ||
                !!state.amountReceivedError,
              onClick: () => {
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
              },
            }}
          />
        </Row>
      </ModalBody>
    </ModalOverlay>
  );
};

export default ModalAddFundingSource;
