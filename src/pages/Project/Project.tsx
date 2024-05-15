import { Social, context, fetch, props, useCallback, useEffect, useMemo, useParams, useState } from "alem";
import DonateSDK from "@app/SDK/donate";
import ListsSDK from "@app/SDK/lists";
import PotSDK from "@app/SDK/pot";
import PotFactorySDK from "../../SDK/potfactory";
import Body from "../Profile/components/Body/Body";
import BannerSkeleton from "./components/BannerSkeleton";
import ProjectBanner from "./components/ProjectBanner/ProjectBanner";
import { Wrapper } from "./styles";
import ProjectOptions from "./utils/ProjectOptions";

const ProjectPage = () => {
  const { projectId, nav } = useParams();
  const accountId = context.accountId;
  const pots = PotFactorySDK.getPots();
  const profile = Social.getr(`${projectId}/profile`);
  const registration = ListsSDK.getRegistration(null, projectId);
  const account = fetch("https://api3.nearblocks.io/v1/account/" + projectId);

  const isReady = pots !== null && profile !== null && registration !== null;

  if (!isReady) return <BannerSkeleton />;

  const isObjectNotEmpty = (obj: any) => Object.keys(obj).length > 0;

  const addressExist = account?.body?.account[0];

  if (!isObjectNotEmpty(addressExist || {}) && !registration) {
    if (account) {
      return <div style={{ marginTop: "1rem", fontSize: "1.5rem" }}>Account does not exist.</div>;
    }
    return "";
  }

  const [directDonations, setDirectDonations] = useState(null);
  // mapping of pot IDs to array of Round Matching Donations for the project
  const [matchingRoundDonations, setMatchingRoundDonations] = useState<any>({});
  const [potPayouts, setPotPayouts] = useState({});

  const getProjectRoundDonations = useCallback(
    (potId: any, potDetail: any) => {
      return PotSDK.asyncGetDonationsForProject(potId, projectId)
        .then((donations: any) => {
          const updatedDonations = donations.map((donation: any) => ({
            ...donation,
            base_currency: potDetail.base_currency,
            pot_name: potDetail.pot_name,
            pot_id: potId,
            type: "matched",
          }));
          setMatchingRoundDonations((prevmMatchingRoundDonations: any) => {
            return { ...prevmMatchingRoundDonations, [potId]: updatedDonations };
          });
        })
        .catch(() => {
          setMatchingRoundDonations((prevmMatchingRoundDonations: any) => {
            return { ...prevmMatchingRoundDonations, [potId]: [] };
          });
        });
    },
    [projectId],
  );

  // Get Project Direct Donations
  useEffect(() => {
    DonateSDK.asyncGetDonationsForRecipient(projectId).then((donationsForRecipient) => {
      if (donationsForRecipient) {
        const updatedDonations = donationsForRecipient.map((donation: any) => ({
          ...donation,
          type: "direct",
        }));
        setDirectDonations(updatedDonations);
      }
    });
  }, [projectId]);

  useEffect(() => {
    if (pots && !matchingRoundDonations[pots[pots.length - 1].id]) {
      pots.forEach((pot: any) => {
        PotSDK.asyncGetConfig(pot.id).then((potDetail: any) => {
          const payout = potDetail.payouts.filter((pay: any) => projectId === pay.project_id)[0];
          if (payout && payout.paid_at) {
            setPotPayouts((prevPayout) => ({
              ...prevPayout,
              [pot.id]: {
                ...payout,
                pot_id: pot.id,
                pot_name: potDetail.pot_name,
                base_currency: potDetail.base_currency,
                type: "payout",
              },
            }));
          }
          getProjectRoundDonations(pot.id, potDetail);
        });
      });
    }
  }, [pots]);

  const allDonations = useMemo(() => {
    const RoundDonationsValue = Object.values(matchingRoundDonations).flat();
    let payouts = Object.values(potPayouts);
    const allDonations = [...(directDonations || []), ...RoundDonationsValue, ...payouts];
    allDonations.sort((a: any, b: any) => {
      const b_donated_at = b.donated_at_ms || b.donated_at || b.paid_at;
      const a_donated_at = a.donated_at_ms || a.donated_at || a.paid_at;
      return b_donated_at - a_donated_at;
    });
    return allDonations;
  }, [matchingRoundDonations, directDonations, potPayouts]);

  return (
    <Wrapper>
      {registration.status !== "Approved" && <ProjectBanner registration={registration} />}

      <Body
        {...{
          profile,
          projectId,
          post: projectId === accountId,
          nav: nav ?? props.nav ?? "home",
          donations: allDonations,
          // directDonations: directDonations,
          matchingRoundDonations: Object.values(matchingRoundDonations).flat(),
          potPayouts: Object.values(potPayouts),
          navOptions: ProjectOptions(projectId),
        }}
      />
    </Wrapper>
  );
};

export default ProjectPage;
