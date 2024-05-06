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
        id={id}
        onClick={onClick}
        className={`${checked ? "active" : ""} ${disabled ? "disabled" : ""}`}
        style={checkBoxStyle}
      >
        <div></div>
      </CheckBoxContent>

      {props.label && (
        <Label htmlFor={id} style={labelStyle} className={`${disabled ? "disabled" : ""}`}>
          {props.label}
        </Label>
      )}
      <Error className={error ? "show" : ""}>{error}</Error>
    </Container>
  );
};

export default CheckBox;
