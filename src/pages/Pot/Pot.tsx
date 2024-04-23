import constants from "@app/constants";
import PotSDK from "@app/SDK/pot";
import { Big, useState, Near, useParams, context, useCache, useMemo } from "alem";
import { BodyContainer, Wrapper } from "./styles";
import navOptions from "./utils/potOptions";
import Tabs from "../Profile/components/Tabs";
import HeaderStatus from "./components/HeaderStatus/HeaderStatus";
import Header from "./components/Header/Header";
import Projects from "./NavPages/Projects/Projects";
import { PotDetail } from "@app/types";
import Applications from "./NavPages/Applications/Applications";
import Donations from "./NavPages/Donations/Donations";
import Sponsors from "./NavPages/Sponsors/Sponsors";
import Payouts from "./NavPages/Payouts/Payouts";

const Pot = () => {
  const { potId, nav: _nav } = useParams();

  Big.PE = 100;

  const [sybilRequirementMet, setSybilRequirementMet] = useState<any>(null);

  const potDetail: PotDetail = PotSDK.getConfig(potId);

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

  // Get total public donations
  const allDonationsPaginated = useCache(() => {
    const limit = 480; // number of donations to fetch per req

    const donationsCount = potDetail.public_donations_count;
    const paginations = [...Array(Math.ceil(donationsCount / limit)).keys()];

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
      return Promise.all([]);
    }
  }, "pot-public-donations");

  const allDonations = allDonationsPaginated ? allDonationsPaginated.flat() : null;

  const options = navOptions(potId || "", potDetail);

  const SelectedNavComponent = useMemo(() => {
    return options.find((option: any) => option.id === nav).source;
  }, []);

  const childProps = {
    allDonations,
    sybilRequirementMet,
    potDetail,
  };

  return (
    <Wrapper>
      <HeaderStatus potDetail={potDetail} />
      <Header potDetail={potDetail} allDonations={allDonations} sybilRequirementMet={sybilRequirementMet} />

      <Tabs nav={nav} navOptions={options} />

      <BodyContainer>
        {nav === "projects" && <Projects {...childProps} />}
        {nav === "applications" && <Applications {...childProps} />}
        {nav === "donations" && <Donations {...childProps} />}
        {nav === "sponsors" && <Sponsors {...childProps} />}
        {nav === "payouts" && <Payouts {...childProps} />}
        {/* {SelectedNavComponent && (
          <SelectedNavComponent
            allDonations={allDonations}
            potDetail={potDetail}
            sybilRequirementMet={sybilRequirementMet}
          />
        )} */}
      </BodyContainer>
    </Wrapper>
  );
};

export default Pot;
