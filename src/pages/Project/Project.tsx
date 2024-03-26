import { Social, useParams } from "alem";
import getProjectByProjectId from "../../services/getProjectByProjectId";
import { Wrapper } from "./styles";
import BannerSkeleton from "./components/BannerSkeleton";
import ProjectBanner from "./components/ProjectBanner/ProjectBanner";
import Body from "../Profile/components/Body/Body";
import ProjectOptions from "./utils/ProjectOptions";

const ProjectPage = () => {
  const { projectId } = useParams();
  const project = getProjectByProjectId(projectId);

  if (project === null) return <BannerSkeleton />;
  if (project == undefined) {
    return <div style={{ marginTop: "1rem", fontSize: "1.5rem" }}>Project not found</div>;
  }

  const profile = Social.getr(`${projectId}/profile`);
  const { nav } = useParams();

  return (
    <Wrapper>
      {project.status !== "Approved" && <ProjectBanner project={project} />}

      <Body
        project={project}
        projectId={projectId}
        profile={profile}
        nav={nav ?? "home"}
        navOptions={ProjectOptions(projectId)}
      />
    </Wrapper>
  );
};

export default ProjectPage;
