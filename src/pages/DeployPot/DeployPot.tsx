import { state } from "alem";
import { Container, HeaderContainer, HeaderTitle, SuccessContainer } from "./styles";
import hrefWithParams from "@app/utils/hrefWithParams";
import Button from "@app/components/Button";
import ConfigForm from "../Pot/NavPages/ConfigForm/ConfigForm";
import HomeBannerStyle from "@app/assets/svgs/HomeBannerBackground";

type Props = {
  deploymentSuccess?: boolean;
  style?: any;
};

const DeployPot = (props: Props) => {
  return props.deploymentSuccess || state.deploymentSuccess ? (
    <SuccessContainer>
      <HeaderTitle>Deployment Successful!</HeaderTitle>
      <Button
        {...{
          type: "primary",
          text: "View all pots",
          style: props.style || {},
          href: hrefWithParams(`?tab=pots`),
        }}
      />
    </SuccessContainer>
  ) : (
    <Container>
      <HeaderContainer
        style={{
          ...HomeBannerStyle,
        }}
      >
        <div className="content">
          <h3 className="sub-title">Deploy pot</h3>
          <h1 className="title">
            Deploy a Quadratic <br className="line-break" />
            Funding Round
          </h1>
          <div className="info">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.3335 3.66732H7.66683V5.00065H6.3335V3.66732ZM6.3335 6.33398H7.66683V10.334H6.3335V6.33398ZM7.00016 0.333984C3.32016 0.333984 0.333496 3.32065 0.333496 7.00065C0.333496 10.6807 3.32016 13.6673 7.00016 13.6673C10.6802 13.6673 13.6668 10.6807 13.6668 7.00065C13.6668 3.32065 10.6802 0.333984 7.00016 0.333984ZM7.00016 12.334C4.06016 12.334 1.66683 9.94065 1.66683 7.00065C1.66683 4.06065 4.06016 1.66732 7.00016 1.66732C9.94016 1.66732 12.3335 4.06065 12.3335 7.00065C12.3335 9.94065 9.94016 12.334 7.00016 12.334Z"
                fill="#7B7B7B"
              />
            </svg>

            <div>Know More about Quadratic Funding</div>
          </div>
        </div>
      </HeaderContainer>
      <ConfigForm />
    </Container>
  );
};

export default DeployPot;
