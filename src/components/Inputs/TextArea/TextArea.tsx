import { Container, Error, Input, Label, Hint } from "./styles";

const TextArea = (props: any) => {
  const label = props.label ?? "Label";
  const placeholder = props.placeholder ?? "Placeholder";
  const value = props.value ?? "";
  const onChange = props.onChange ?? (() => {});
  const validate = props.validate ?? (() => {});
  const error = props.error ?? "";

  return (
    <Container style={props.containerStyle ?? {}}>
      {!props.noLabel && <Label style={props.labelStyle ?? {}}>{label}</Label>}
      <Input
        placeholder={placeholder}
        value={value}
        onChange={({ target: { value } }) => onChange(value)}
        onBlur={() => validate()}
        rows={props.inputRows ?? 5}
        style={props.inputStyle ?? {}}
        disabled={!!props.disabled}
      />
      {props.maxCharacters && (
        <Hint>
          <div className="label">Hint text</div>
          <div className="value">
            {value.length}/{props.maxCharacters}
          </div>
        </Hint>
      )}
      <Error style={props.errorStyle ?? {}} className={error ? "show" : ""}>
        {error}
      </Error>
    </Container>
  );
};

export default TextArea;
