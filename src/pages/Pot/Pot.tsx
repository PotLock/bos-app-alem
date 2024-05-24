import { Big, useParams, useCache, useMemo } from "alem";
import PotSDK from "@app/SDK/pot";
import useModals from "@app/hooks/useModals";
import { PotDetail } from "@app/types";
import Tabs from "../Profile/components/Tabs";
import Header from "./components/Header/Header";
import HeaderStatus from "./components/HeaderStatus/HeaderStatus";
import { BodyContainer, Wrapper } from "./styles";
import navOptions from "./utils/potOptions";

const Pot = () => {
  const { potId, nav: _nav } = useParams();

  Big.PE = 100;

  const potDetail: PotDetail = PotSDK.getConfig(potId);

  const noPot = potDetail === undefined;
  const loading = potDetail === null;

  if (loading) return <div className="spinner-border text-secondary" role="status" />;

  if (noPot) return "No pot found";

  const now = Date.now();
  const applicationNotStarted = now < potDetail.application_start_ms;
  const applicationOpen = now >= potDetail.application_start_ms && now < potDetail.application_end_ms;

  const publicRoundOpen = now >= potDetail.public_round_start_ms && now < potDetail.public_round_end_ms;
  const publicRoundClosed = now >= potDetail.public_round_end_ms;

  const payoutsPending = publicRoundClosed && !potDetail.cooldown_end_ms;
  let nav = _nav;

  if (!nav) {
    applicationNotStarted
      ? (nav = "sponsors")
      : applicationOpen
      ? (nav = "applications")
      : publicRoundOpen
      ? (nav = "projects")
      : !payoutsPending
      ? (nav = "donations")
      : (nav = "payouts");
    // default to home tab
  }

  const options = navOptions(potId || "", potDetail);

  const SelectedNavComponent = useMemo(() => {
    return options.find((option: any) => option.id === nav).source;
  }, []);

  const Modals = useModals();

  return (
    <Wrapper>
      <Modals />
      <HeaderStatus />
      <Header />

      <Tabs nav={nav} navOptions={options} />

      <BodyContainer>{SelectedNavComponent && <SelectedNavComponent potDetail={potDetail} />}</BodyContainer>
    </Wrapper>
  );
};

export default Pot;
