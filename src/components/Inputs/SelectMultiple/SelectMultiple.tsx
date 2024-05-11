import { Typeahead } from "alem";
import { Container, Label } from "./styles";

type Props = {
  label: string;
  options: any;
  onChange: (selected: any) => void;
  placeholder: string;
  selected: any;
};

const SelectMultiple = (props: Props) => {
  const { label, options, onChange, placeholder, selected } = props;

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <Typeahead options={options} multiple onChange={onChange} placeholder={placeholder} selected={selected} />
    </Container>
  );
};

export default SelectMultiple;
