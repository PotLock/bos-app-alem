import { MouseEventHandler } from "react";
import CheckIcon from "@app/assets/svgs/CheckIcon";
import { CheckBoxContent, Container, Error, Label } from "./styles";

type Props = {
  id?: string;
  label?: string;
  disabled?: boolean;
  checked: boolean;
  onClick: MouseEventHandler<HTMLInputElement>;
  containerStyle?: React.CSSProperties;
  checkBoxStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  error?: string;
};

const CheckBox = (props: Props) => {
  const { id, disabled, checked, onClick, label } = props;
  const containerStyle = props.containerStyle ?? {};
  const checkBoxStyle = props.checkBoxStyle ?? {};
  const labelStyle = props.labelStyle ?? {};
  const error = props.error ?? "";

  return (
    <Container style={containerStyle}>
      <CheckBoxContent className={`${checked ? "active" : ""} ${disabled ? "disabled" : ""}`} style={checkBoxStyle}>
        <input type="checkbox" id={id} onClick={onClick} />
        <CheckIcon />
      </CheckBoxContent>

      {label && (
        <Label htmlFor={id} style={labelStyle} className={`${disabled ? "disabled" : ""}`}>
          {label}
        </Label>
      )}
      <Error className={error ? "show" : ""}>{error}</Error>
    </Container>
  );
};

export default CheckBox;
