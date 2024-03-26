import Card from "../Card/Card";
import { ContainerHeader, Header, OnBottom, ProjectList, Title } from "./styles";
import getProjects from "../../../../services/getProjects";

const FeaturedProjects = () => {
  const { featuredProjects } = getProjects();

  return (
    <ContainerHeader tab="">
      <Header>
        <Title>Featured projects</Title>
      </Header>

      <ProjectList>
        {featuredProjects.map((project: any) => {
          return <Card projectId={project.id} allowDonate={true} />;
        })}
      </ProjectList>
      <OnBottom></OnBottom>
    </ContainerHeader>
  );
};

export default FeaturedProjects;
