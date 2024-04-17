import { NadabotBanner } from "./styles";

const NADA_BOT_ICON = "bafkreicojpp23dmf7hakbt67eah4ba52dx3reekdccaupoggzzlhdkroyi";

const Nadabot = () => (
  <NadabotBanner>
    <div className="label">
      <img src={`https://ipfs.near.social/ipfs/${NADA_BOT_ICON}`} alt="nadabot" />
      You need to be verified to donate.
    </div>
    <a href="https://app.nada.bot/" target="_blank" className="verify">
      Verify to donate
    </a>
  </NadabotBanner>
);

export default Nadabot;
