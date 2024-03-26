import { State } from "alem";
import {
  Button,
  ButtonRegisterProject,
  ButtonsContainer,
  HeaderContainer,
  HeaderContent,
  HeaderDescription,
  HeaderTitle,
  HeroContainer,
  Underline,
} from "./styles";
import DonationStats from "../DonationStats/DonationStats";

type Props = {
  donateRandomlyClick: () => void;
};

const Hero = ({ donateRandomlyClick }: Props) => {
  State.init({});

  return (
    <HeroContainer>
      <HeaderContainer>
        <HeaderContent>
          <HeaderTitle>
            Transforming
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
          <HeaderTitle>Funding for Public Goods</HeaderTitle>
          <HeaderDescription>
            Discover impact projects, donate directly, & participate in funding rounds.
          </HeaderDescription>
        </HeaderContent>

        <ButtonsContainer>
          <Button onClick={donateRandomlyClick}>Donate Randomly</Button>
          {/* <ButtonRegisterProject href={"?tab=createproject"}>Register Your Project</ButtonRegisterProject> */}
          <ButtonRegisterProject>Register Your Project</ButtonRegisterProject>
        </ButtonsContainer>
        <DonationStats />
      </HeaderContainer>
    </HeroContainer>
  );
};

export default Hero;
