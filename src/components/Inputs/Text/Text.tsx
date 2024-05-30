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
  defaultValue?: string;
  preInputChildren?: any;
  postInputChildren?: any;
  disabled?: boolean;
  percent?: boolean;
  inputStyles?: React.CSSProperties;
  containerStyles?: React.CSSProperties;
  inputContainerStyles?: React.CSSProperties;
};

const Text = (props: Props) => {
  const label = props.label ?? "";
  const placeholder = props.placeholder ?? "";
  const value = props.value;
  const onChange = props.onChange ?? (() => {});
  const onBlur = props.onBlur ?? (() => {});
  const validate = props.validate ?? (() => {});
  const error = props.error ?? "";

  return (
    <Container style={props.containerStyles || {}}>
      {label && <Label>{label}</Label>}
      <InputContainer style={props.inputContainerStyles || {}}>
        {props.preInputChildren && props.preInputChildren}
        <Input
          type="text"
          defaultValue={props.defaultValue || ""}
          placeholder={placeholder}
          {...(value !== undefined && { value })}
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
      {error && <Error>{error}</Error>}
    </Container>
  );
};

export default Text;
