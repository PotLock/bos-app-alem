import { useEffect, useMemo, useParams, useState } from "alem";
import PotSDK from "@app/SDK/pot";
import PotFactorySDK from "@app/SDK/potfactory";
import PotCard from "@app/components/PotCard/PotCard";
import ListSection from "@app/pages/Projects/components/ListSection";
import { Container, NoResults } from "./styles";

const Pots = () => {
  const pots = PotFactorySDK.getPots();
  const { projectId } = useParams();

  const POT_STATUS = ["Approved", "pending"];

  const [potIds, setPotIds] = useState<any>(null); // ids[] of pots that approved project

  useEffect(() => {
    if (pots && !potIds) {
      const applicationsPrmomises = pots.map(({ id }: any) => PotSDK.asyncGetApplicationByProjectId(id, projectId));
      Promise.allSettled(applicationsPrmomises).then((applications: any) => {
        const enrolledPots: any = [];
        applications.forEach((obj: any, idx: number) => {
          if (POT_STATUS.includes(obj.value.status)) {
            enrolledPots.push(pots[idx]);
          }
        });
        setPotIds(enrolledPots);
      });
    }
  }, [pots]);

  return potIds === null ? (
    "Loading..."
  ) : potIds.length ? (
    <ListSection maxCols={3} items={potIds} renderItem={(pot: any) => <PotCard potId={pot.id} key={pot.id} />} />
  ) : (
    <NoResults>
      <div className="text">This project has not participated in any pots yet.</div>
      <img src="https://ipfs.near.social/ipfs/bafkreibcjfkv5v2e2n3iuaaaxearps2xgjpc6jmuam5tpouvi76tvfr2de" alt="pots" />
    </NoResults>
  );
};

export default Pots;
