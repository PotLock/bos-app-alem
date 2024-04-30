import Card from "@app/components/Card/Card";
import { Project } from "@app/types";
import { InfiniteScroll, useState } from "alem";

const ListProjects = ({ projects }: { projects: any }) => {
  const [lastNumber, setLastNumber] = useState(0);
  const [display, setDisplay] = useState([]);

  const loadNumbers = (page: number) => {
    const toDisplay: any = projects
      .slice(0, lastNumber + page * 9)
      .map((project: Project) => <Card projectId={project.registrant_id} allowDonate={true} />);

    setDisplay(toDisplay);
    setLastNumber(lastNumber + page * 10);
  };

  return (
    <InfiniteScroll loadMore={loadNumbers} hasMore={lastNumber < projects.length} useWindow={false}>
      {display}
    </InfiniteScroll>
  );
};

export default ListProjects;
