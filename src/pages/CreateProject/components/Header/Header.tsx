import DonationStats from "@app/pages/Projects/components/DonationStats/DonationStats";
import { ButtonsContainer, HeaderContainer, HeaderContent, HeaderDescription, HeaderTitle, Underline } from "./stlyes";
import { useParams } from "alem";
import { CSSProperties } from "styled-components";

type Props = {
  containerStyle?: CSSProperties;
  centered?: boolean;
  title1: string;
  title2?: string;
  description: string;
  children?: any;
  buttonPrimary?: any;
  buttonSecondary?: any;
};

const Header = (props: Props) => {
  const containerStyle = props.containerStyle ?? {};

  const { tab } = useParams();

  const showStats = !tab || tab == "projects";

  return (
    <HeaderContainer style={containerStyle}>
      <HeaderContent
        style={{
          alignItems: props.centered ? "center" : "flex-start",
        }}
      >
        <HeaderTitle>
          {props.title1}
          <Underline>
            <svg width="340" height="42" viewBox="0 0 340 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.29967 39C-14.0566 35.9491 49.9788 32.436 71.4774 30.6444C151.734 23.9564 232.915 20.5161 312.9 15"
                stroke="#DD3345"
                stroke-width="5"
                stroke-linecap="round"
              />
              <path
                d="M31.2997 27C9.94337 23.9491 73.9788 20.436 95.4774 18.6444C175.734 11.9564 256.915 8.51608 336.9 3"
                stroke="#DD3345"
                stroke-width="5"
                stroke-linecap="round"
              />
            </svg>
          </Underline>
        </HeaderTitle>
        {props.title2 && <HeaderTitle>{props.title2}</HeaderTitle>}
        <HeaderDescription
          style={{
            textAlign: props.centered ? "center" : "start",
          }}
        >
          {props.description}
        </HeaderDescription>
      </HeaderContent>
      {props.children && props.children}
      <ButtonsContainer>
        {props.buttonPrimary && props.buttonPrimary}
        {props.buttonSecondary && props.buttonSecondary}
      </ButtonsContainer>
      {showStats && <DonationStats />}
    </HeaderContainer>
  );
};

export default Header;
