import { CheckBox, Container } from "./styles";

const Checks = ({ options, value, onClick }: any) => {
  return (
    <Container>
      {options.map((option: any) => (
        <div
          key={option.val}
          onClick={() => onClick(option.val)}
          className={`${value === option.val ? "active" : ""} ${option.disabled ? "disabled" : ""}`}
        >
          <CheckBox className={`${value === option.val ? "active" : ""}`}>
            <div></div>
          </CheckBox>
          <div className="text">
            {option.label} {option.info && <span> {option.info} </span>}
            {option.disabled && <span> {option.disabledText} </span>}
          </div>
        </div>
      ))}
    </Container>
  );
};

export default Checks;
