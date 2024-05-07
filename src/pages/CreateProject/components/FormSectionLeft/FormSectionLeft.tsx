import {
  FormSectionLeftDiv,
  FormSectionIsRequired,
  FormSectionTitle,
  FormSectionDescription,
  SvgContainer,
} from "./styles";

type Props = {
  title: string;
  description?: string;
  isRequired?: boolean;
};

const FormSectionLeft = ({ title, description, isRequired }: Props) => {
  return (
    <FormSectionLeftDiv>
      <FormSectionTitle>{title}</FormSectionTitle>
      <FormSectionDescription>{description}</FormSectionDescription>
      <FormSectionIsRequired
        style={{
          color: isRequired ? "#DD5633" : "#7B7B7B",
        }}
      >
        {isRequired ? "Required" : "Optional"}
        {isRequired && (
          <SvgContainer style={{ top: -6, left: -26 }}>
            <svg width="117" height="31" viewBox="0 0 117 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M81.8 3.40116C82.247 3.1908 83.0709 3.13488 82.6 2.60116C81.0461 0.840105 83.0819 0.798833 78.6667 1.22338C65.6302 2.47689 52.5192 4.47997 39.6667 6.95672C31.3106 8.56697 19.0395 10.1936 12.7333 17.09C3.95785 26.6869 29.2286 29.1656 32.9333 29.3567C53.953 30.4413 75.9765 28.9386 96.5111 24.1789C99.8286 23.41 122.546 18.5335 112.733 11.5345C107.621 7.88815 100.796 6.47335 94.7333 5.75672C77.7504 3.74928 60.1141 5.22649 43.2222 7.35671C28.8721 9.16641 14.4138 11.8506 1 17.4012"
                stroke="#2E2E2E"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
          </SvgContainer>
        )}
      </FormSectionIsRequired>
    </FormSectionLeftDiv>
  );
};
export default FormSectionLeft;
