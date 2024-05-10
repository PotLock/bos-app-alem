import NearIcon from "@app/assets/svgs/near-icon";
import Select from "@app/components/Inputs/Select/Select";
import nearToUsd from "@app/utils/nearToUsd";
import { Container, DropdownWrapper, PotDenomination } from "./styles";

const AmountInput = (props: any) => {
  const Dropdown = ({ selectedDenomination, denominationOptions, updateState, amount, getTokenBalance }: any) => (
    <DropdownWrapper>
      <Select
        {...{
          noLabel: true,
          placeholder: "",
          options: denominationOptions,
          value: {
            text: selectedDenomination.text,
            value: selectedDenomination.value,
          },
          onChange: ({ value }: any) => {
            const tokenBalance = parseFloat(getTokenBalance(value));
            updateState({
              selectedDenomination: denominationOptions.find((option: any) => option.value === value),
              amountError:
                tokenBalance > parseFloat(amount) ? "" : "You don’t have enough balance to complete this transaction.",
            });
          },
          containerStyles: {
            width: "auto",
          },
          inputStyles: {
            border: "none",
            boxShadow: "none",
            width: "auto",
            padding: "12px 16px",
            height: "100%",
            color: "#292929",
          },
          iconLeft: selectedDenomination.icon ? (
            <img src={selectedDenomination.icon} style={{ height: "16px", width: "16px" }} />
          ) : (
            <NearIcon />
          ),
        }}
      />
    </DropdownWrapper>
  );
  const { value, amount, HandleAmoutChange, donationType, denominationOptions, selectedDenomination } = props;
  const _value = value || amount || 0;

  return (
    <Container>
      <input
        type="text"
        value={_value}
        placeholder="0"
        onChange={(e) => HandleAmoutChange(e.target.value)}
        name="amount"
      />
      <div className="usd-amount">
        {" "}
        {nearToUsd && selectedDenomination.value === "NEAR" ? `~$ ${(nearToUsd * _value).toFixed(2)}` : ""}
      </div>
      {donationType === "pot" || denominationOptions.length === 1 ? (
        <PotDenomination>
          <NearIcon />
          <div className="text">{denominationOptions[0].text}</div>
        </PotDenomination>
      ) : (
        <Dropdown {...props} />
      )}
    </Container>
  );
};

export default AmountInput;
