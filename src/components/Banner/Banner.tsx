import PotSDK from "@app/SDK/pot";
import PotFactorySDK from "@app/SDK/potfactory";
import { useEffect, useState } from "alem";
import { Container, Wrapper } from "./styles";
import hrefWithParams from "@app/utils/hrefWithParams";

const Banner = () => {
  const [activeRounds, setActiveRounds] = useState<any>([]);

  const pots = PotFactorySDK.getPots();

  const now = Date.now();

  useEffect(() => {
    if (pots) {
      pots.forEach((pot: any) => {
        PotSDK.asyncGetConfig(pot.id)
          .then((potConfig: any) => {
            const { public_round_start_ms, public_round_end_ms } = potConfig;
            if (public_round_start_ms < now && public_round_end_ms > now) {
              setActiveRounds((prevActiveRounds: any) => [
                ...prevActiveRounds,
                {
                  ...potConfig,
                  pot_id: pot.id,
                },
              ]);
            }
          })
          .catch((e: any) => {
            console.error("error getting pot detail: ", e);
          });
      });
    }
  }, [pots]);

  const isSingleRound = activeRounds.length === 1;
  const limit = isSingleRound ? 20 : 10;
  const potName =
    activeRounds[0].pot_name.length > limit
      ? activeRounds[0].pot_name.slice(0, limit).trim() + "..."
      : activeRounds[0].pot_name;

  const textForOneRound = `${potName} round is live`;
  const textForMultipleRounds = `Pot round is live for ${potName} and +${activeRounds.length - 1} More`;

  if (!activeRounds.length) return "";
  return (
    <Wrapper>
      <Container>
        <div className="text">
          {isSingleRound ? textForOneRound : textForMultipleRounds}
          <a
            href={hrefWithParams(isSingleRound ? `?tab=pot&potId=${activeRounds[0].pot_id}` : `?tab=pots`)}
            className="link"
          >
            {isSingleRound ? "Donate" : "Check Now"}
            <img
              src="https://ipfs.near.social/ipfs/bafkreigots5l4o5d3a4zksfimch3gvqw7ezb2quundmjwml33abo5atgwi"
              alt="arrow"
            />
          </a>
        </div>
      </Container>
    </Wrapper>
  );
};

export default Banner;
