import { useParams, useState } from "alem";
import PotSDK from "@app/SDK/pot";
import PotFactorySDK from "@app/SDK/potfactory";
import PotCard from "@app/components/PotCard/PotCard";
import { Container, NoResults } from "./styles";

const Pots = () => {
  const pots = PotFactorySDK.getPots();
  const { projectId } = useParams();

  const [potIds, setPotIds] = useState<any>(null); // ids[] of pots that approved project
  const [loading, setLoading] = useState(true); // ids[] of pots that approved project

  const getApprovedApplications = (potId: any) =>
    PotSDK.asyncGetApprovedApplications(potId)
      .then((applications: any) => {
        if (applications.some((app: any) => app.project_id === projectId)) {
          setPotIds([...(potIds || []), potId]);
        }
        if (pots[pots.length - 1].id === potId) setLoading(false);
      })
      .catch(() => console.log(`Error fetching approved applications for ${potId}`));

  if (pots && loading) {
    pots.forEach((pot: any) => {
      getApprovedApplications(pot.id);
    });
  }

  return loading ? (
    "Loading..."
  ) : potIds.length ? (
    <Container>
      {potIds.map((potId: string) => (
        <PotCard {...{ potId, tab: "pots" }} />
      ))}
    </Container>
  ) : (
    <NoResults>
      <div className="text">This project has not participated in any pots yet.</div>
      <img src="https://ipfs.near.social/ipfs/bafkreibcjfkv5v2e2n3iuaaaxearps2xgjpc6jmuam5tpouvi76tvfr2de" alt="pots" />
    </NoResults>
  );
};

export default Pots;
