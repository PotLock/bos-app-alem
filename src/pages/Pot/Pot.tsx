import constants from "@app/constants";
import PotSDK from "@app/SDK/pot";
import { Big, useState, Near, useParams, context, props, useCache } from "alem";
import { BodyContainer, Wrapper } from "./styles";
import navOptions from "./utils/potOptions";
import NewApplicationModal from "./components/NewApplicationModal/NewApplicationModal";
import Tabs from "../Profile/components/Tabs";
import HeaderStatus from "./components/HeaderStatus/HeaderStatus";
import Header from "./components/Header/Header";
import Projects from "./NavPages/Projects/Projects";

const Pot = () => {
  const { potId, nav } = useParams();

  Big.PE = 100;

  const [sybilRequirementMet, setSybilRequirementMet] = useState<any>(null);
  const [emptyNav, setEmptyNav] = useState<any>("projects");

  const potDetail = PotSDK.getConfig(potId);

  if (sybilRequirementMet === null) {
    if (potDetail.sybil_wrapper_provider) {
      const [contractId, methodName] = potDetail.sybil_wrapper_provider.split(":");
      Near.asyncView(contractId, methodName, { account_id: context.accountId })
        .then((result) => {
          setSybilRequirementMet(result);
        })
        .catch((e) => {
          setSybilRequirementMet(false);
        });
    } else {
      setSybilRequirementMet(true);
    }
  }

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

  if (!nav) {
    let nav;
    applicationNotStarted
      ? (nav = "sponsors")
      : applicationOpen
      ? (nav = "applications")
      : publicRoundOpen
      ? (nav = "projects")
      : !payoutsPending
      ? (nav = "donations")
      : (nav = "payouts");
    setEmptyNav(nav);
    // default to home tab
  }
  //   props.navOptions = navOptions(potId)

  // Get total public donations
  const allDonationsPaginated = useCache(() => {
    const limit = 480; // number of donations to fetch per req
    const donationsCount = potDetail.public_donations_count;
    const paginations = [...Array(parseInt(donationsCount / limit) + (donationsCount % limit > 0 ? 1 : 0)).keys()];
    try {
      const allDonations = paginations.map((index) =>
        PotSDK.asyncGetPublicRoundDonations(potId, {
          from_index: index * limit,
          limit: limit,
        }),
      );
      return Promise.all(allDonations);
    } catch (error) {
      console.error(`error getting public donations`, error);
    }
  }, "pot-public-donations");

  const allDonations = allDonationsPaginated ? allDonationsPaginated.flat() : null;

  const options = navOptions(potId || "");

  const SelectedNavComponent = options.find((option: any) => option.id === (nav || emptyNav));
  console.log("SelectedNavComponent", SelectedNavComponent);

  return (
    <Wrapper>
      <HeaderStatus potDetail={potDetail} />
      <Header potDetail={potDetail} allDonations={allDonations} sybilRequirementMet={sybilRequirementMet} />

      <Tabs nav={nav ?? emptyNav} navOptions={options} />

      <BodyContainer>
        <Projects allDonations={allDonations} potDetail={potDetail} sybilRequirementMet={sybilRequirementMet} />
      </BodyContainer>
    </Wrapper>
  );
};

export default Pot;
