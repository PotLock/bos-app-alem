import { context } from "alem";
import PotFactorySDK from "@app/SDK/potfactory";
import HomeBannerStyle from "@app/assets/svgs/HomeBannerBackground";
import Button from "@app/components/Button";
import hrefWithParams from "@app/utils/hrefWithParams";
import { Container } from "./styles";

const Banner = () => {
  const canDeploy = PotFactorySDK.canUserDeployPot(context.accountId);

  return (
    <Container
      style={{
        ...HomeBannerStyle,
      }}
    >
      <div className="content">
        <h3 className="sub-title">Explore Pots</h3>
        <h1 className="title">
          Donate to Matching Rounds <br className="line-break" /> to Get Your Contributions Amplified.
        </h1>
        <div className="btns">
          {canDeploy && <Button href={hrefWithParams(`?tab=deploypot`)}>Deploy Pot</Button>}
          <Button varient={canDeploy ? "tonal" : "filled"} href="https://wtfisqf.com" target="_blank">
            Learn More
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Banner;
