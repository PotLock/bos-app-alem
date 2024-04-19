import { Project } from "../../../../types";
import ListSection from "../ListSection";
import { ProjectsContainer } from "./styles";
import Card from "@app/components/Card/Card";

type Props = {
  filteredProjects: Project[];
  isRegistryAdmin: boolean;
};

const AllProjects = ({ filteredProjects, isRegistryAdmin }: Props) => {
  return (
    <ProjectsContainer>
      {filteredProjects.length ? (
        <ListSection
          shouldShuffle={!isRegistryAdmin}
          items={filteredProjects.slice(0, 51)}
          renderItem={(project: Project) => <Card projectId={project.id} allowDonate={true} />}
        />
      ) : (
        <div style={{ alignSelf: "flex-start", margin: "24px 0px" }}>No results</div>
      )}
    </ProjectsContainer>
  );
};

export default AllProjects;
