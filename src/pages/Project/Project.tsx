import { Social, context, fetch, props, useMemo, useParams, useState } from "alem";
import getProjectByProjectId from "../../services/getProjectByProjectId";
import PotFactorySDK from "../../SDK/potfactory";
import { Wrapper } from "./styles";
import BannerSkeleton from "./components/BannerSkeleton";
import ProjectBanner from "./components/ProjectBanner/ProjectBanner";
import Body from "../Profile/components/Body/Body";
import ProjectOptions from "./utils/ProjectOptions";
import ListsSDK from "@app/SDK/lists";
import PotSDK from "@app/SDK/pot";
import DonateSDK from "@app/SDK/donate";

const ProjectPage = () => {
  const { projectId } = useParams();
  const accountId = context.accountId;
  const project = getProjectByProjectId(projectId);
  const pots = PotFactorySDK.getPots();

  const registration = ListsSDK.getRegistration(null, projectId);

  const account = fetch("https://api3.nearblocks.io/v1/account/" + projectId);

  if (registration === null || account === null) return <BannerSkeleton />;

  const isObjectNotEmpty = (obj: any) => Object.keys(obj).length > 0;

  const addressExist = account?.body?.account[0];

  if (!isObjectNotEmpty(addressExist || {}) && !registration)
    return <div style={{ marginTop: "1rem", fontSize: "1.5rem" }}>Account does not exist.</div>;

  const [directDonations, setDirectDonations] = useState(null);
  // mapping of pot IDs to array of Round Matching Donations for the project
  const [matchingRoundDonations, setMatchingRoundDonations] = useState<any>({});
  const [potPayouts, setPotPayouts] = useState({});

  const getProjectRoundDonations = (potId: any, potDetail: any) => {
    return PotSDK.asyncGetDonationsForProject(potId, projectId)
      .then((donations: any) => {
        const updatedDonations = donations.map((donation: any) => ({
          ...donation,
          base_currency: potDetail.base_currency,
          pot_name: potDetail.pot_name,
          pot_id: potId,
          type: "matched",
        }));
        // if (roundDonations[potId]) return "";
        setMatchingRoundDonations((prevmMatchingRoundDonations: any) => {
          return { ...prevmMatchingRoundDonations, [potId]: updatedDonations };
        });
      })
      .catch(() => {
        // if (roundDonations[potId]) return "";
        setMatchingRoundDonations((prevmMatchingRoundDonations: any) => {
          return { ...prevmMatchingRoundDonations, [potId]: [] };
        });
      });
  };

  // Get Project Direct Donations
  let donationsForRecipient = DonateSDK.getDonationsForRecipient(projectId);
  if (donationsForRecipient && !directDonations) {
    donationsForRecipient = donationsForRecipient.map((donation: any) => ({
      ...donation,
      type: "direct",
    }));
    setDirectDonations(donationsForRecipient);
  }

  if (pots && !matchingRoundDonations[pots[pots.length - 1].id]) {
    pots.forEach((pot: any) => {
      PotSDK.asyncGetConfig(pot.id).then((potDetail: any) => {
        const payout = potDetail.payouts.filter((pay: any) => projectId === pay.project_id)[0];
        if (payout.paid_at)
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
        getProjectRoundDonations(pot.id, potDetail);
      });
    });
  }

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

  const profile = Social.getr(`${projectId}/profile`);

  if (project === null) return <BannerSkeleton />;
  if (project == undefined) {
    return <div style={{ marginTop: "1rem", fontSize: "1.5rem" }}>Project not found</div>;
  }

  const { nav } = useParams();

  return (
    <Wrapper>
      {project.status !== "Approved" && <ProjectBanner project={project} />}

      <Body
        {...{
          project,
          profile,
          registration,
          projectId,
          post: projectId === accountId,
          nav: nav ?? props.nav ?? "home",
          donations: allDonations,
          directDonations: directDonations,
          matchingRoundDonations: Object.values(matchingRoundDonations).flat(),
          potPayouts: Object.values(potPayouts),
          navOptions: ProjectOptions(projectId),
        }}
      />
    </Wrapper>
  );
};

export default ProjectPage;
