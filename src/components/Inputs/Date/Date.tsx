import { Container, Error, Input, InputContainer, Label } from "./styles";

type Props = {
  label?: any;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  validate?: () => void;
  error?: string;
  preInputChildren?: any;
  postInputChildren?: any;
  selectTime?: boolean;
  disabled?: boolean;
  handleKeyPress?: (e: any) => void;
  inputStyles?: any;
};

const DateInput = (props: Props) => {
  const label = props.label ?? "";
  const placeholder = props.placeholder ?? "";
  const value = props.value ?? "";
  const onChange = props.onChange ?? (() => {});
  const validate = props.validate ?? (() => {});
  const error = props.error ?? "";

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <InputContainer>
        {props.preInputChildren && props.preInputChildren}
        <Input
          type={props.selectTime ? "datetime-local" : "date"}
          placeholder={placeholder}
          value={value}
          onChange={({ target: { value } }) => onChange(value)}
          onBlur={() => validate()}
          disabled={!!props.disabled}
          onKeyDown={props.handleKeyPress ?? (() => {})}
          style={props.inputStyles || {}}
        />
        {props.postInputChildren && props.postInputChildren}
      </InputContainer>
      <Error className={error ? "show" : ""}>{error}</Error>
    </Container>
  );
};

export default DateInput;
