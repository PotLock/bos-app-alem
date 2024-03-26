import { Container, Content, Input, Item, Label, Placeholder, Viewport } from "./styles";

type Props = {
  label?: string;
  noLabel?: boolean;
  placeholder?: string;
  value?: any;
  options?: any[];
  onChange?: (value: any) => void;
  validate?: () => void;
  error?: string;
  containerStyles?: React.CSSProperties;
  inputStyles?: React.CSSProperties;
  iconLeft?: any;
};

// const Select = ({label, noLabel, placeholder, value, options, onChange, validate, error}: Props) => {
const Select = (componentProps: Props) => {
  const label = componentProps.label ?? "Label";
  const noLabel = componentProps.noLabel ?? false;
  const placeholder = componentProps.placeholder ?? "Select an option";
  const value = componentProps.value ?? "";
  const options = componentProps.options ?? [];
  const onChange = componentProps.onChange ?? (() => {});
  const validate = componentProps.validate ?? (() => {});
  const error = componentProps.error ?? "";

  return (
    <Container style={componentProps.containerStyles || {}}>
      {noLabel ? <></> : <Label>{label}</Label>}
      <Select.Root
        value={value?.value}
        onValueChange={(value: any) => onChange(options.find((option: any) => option.value === value))}
      >
        <Select.Trigger asChild={true}>
          <Input style={componentProps.inputStyles || {}}>
            {componentProps.iconLeft && componentProps.iconLeft}
            <Select.Value aria-label={value.value} placeholder={<Placeholder>{placeholder}</Placeholder>} />
            {/* {props.iconRight ? (
            <Select.Icon>{props.iconRight}</Select.Icon>
          ) : ( */}
            <Select.Icon>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="currentColor"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Select.Icon>
            {/* )} */}
          </Input>
        </Select.Trigger>

        <Select.Content asChild={true}>
          <Content>
            <Select.Viewport asChild={true}>
              <Viewport>
                {options.map(({ text, value }) => (
                  <Select.Item value={value} asChild={true}>
                    <Item>
                      <Select.ItemText>{text}</Select.ItemText>
                      <Select.ItemIndicator>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                            fill="currentColor"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </Select.ItemIndicator>
                    </Item>
                  </Select.Item>
                ))}
              </Viewport>
            </Select.Viewport>
          </Content>
        </Select.Content>
      </Select.Root>
    </Container>
  );
};

export default Select;
