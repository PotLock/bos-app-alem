import { context } from "alem";
import HomeBannerBackground from "@app/assets/svgs/HomeBannerBackground";
import { Container } from "./styles";
import hrefWithParams from "@app/utils/hrefWithParams";
import PotFactorySDK from "@app/SDK/potfactory";

const Banner = () => {
  const canDeploy = PotFactorySDK.canUserDeployPot(context.accountId);

  return (
    <Container>
      <HomeBannerBackground className="background" />

      <div className="content">
        <h3 className="sub-title">Explore Pots</h3>
        <h1 className="title">
          Donate to Matching Rounds <br className="line-break" /> to Get Your Contributions Amplified.
        </h1>
        <div className="btns">
          {canDeploy && <a href={hrefWithParams(`?tab=deploypot`)}>Deploy Pot</a>}
          <a href="https://wtfisqf.com" target="_blank">
            Learn More
          </a>
        </div>
      </div>
    </Container>
  );
};

export default Banner;
