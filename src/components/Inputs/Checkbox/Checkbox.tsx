import { CheckBoxContent, Container, Error, Label } from "./styles";

const CheckBox = (props: any) => {
  const { id, disabled, checked, onClick } = props;
  const containerStyle = props.containerStyle ?? {};
  const checkBoxStyle = props.checkBoxStyle ?? {};
  const labelStyle = props.labelStyle ?? {};
  const error = props.error ?? "";

  return (
    <Container style={containerStyle}>
      <CheckBoxContent
        type="checkbox"
        style={checkBoxStyle}
        id={id}
        disabled={disabled}
        checked={checked}
        onClick={onClick}
      />
      {props.label && (
        <Label htmlFor={id} style={labelStyle}>
          {props.label}
        </Label>
      )}
      <Error className={error ? "show" : ""}>{error}</Error>
    </Container>
  );
};

export default CheckBox;
