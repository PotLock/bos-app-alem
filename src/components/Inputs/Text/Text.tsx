import { Container, Error, Input, InputContainer, Label, PercentageSign } from "./styles";

type Props = {
  label?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  handleKeyPress?: any;
  onBlur?: (value: any) => void;
  validate?: () => void;
  error?: string;
  preInputChildren?: any;
  postInputChildren?: any;
  disabled?: boolean;
  percent?: boolean;
  inputStyles?: any;
};

const Text = (props: Props) => {
  const label = props.label ?? "";
  const placeholder = props.placeholder ?? "";
  const value = props.value ?? "";
  const onChange = props.onChange ?? (() => {});
  const onBlur = props.onBlur ?? (() => {});
  const validate = props.validate ?? (() => {});
  const error = props.error ?? "";

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <InputContainer>
        {props.preInputChildren && props.preInputChildren}
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={({ target: { value } }) => onChange(value)}
          onBlur={(value) => {
            validate();
            if (onBlur) onBlur(value);
          }}
          disabled={!!props.disabled}
          onKeyDown={props.handleKeyPress ?? null}
          style={props.inputStyles || {}}
          name={props.name}
        />
        {props.percent && <PercentageSign>%</PercentageSign>}
        {props.postInputChildren && props.postInputChildren}
      </InputContainer>
      <Error className={error ? "show" : ""}>{error}</Error>
    </Container>
  );
};

export default Text;
