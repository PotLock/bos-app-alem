import { useEffect, useMemo, useState } from "alem";
import Card from "@app/components/Card/Card";
import { Project } from "@app/types";
import CardSkeleton from "../CardSkeleton";
import { ContainerHeader, Header, OnBottom, ProjectList, Title } from "./styles";

const FeaturedProjects = ({ projectsData, isLoading }: { projectsData: any; isLoading: boolean }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  // console.log("B", projectsData, projects, isLoading);
  // console.log('FeaturedProjects - Render');

  // TODO: Criar um formato para o compilador saber quando é um arquivo
  // de custom hook e injetar no arquivo
  useEffect(() => {
    if (projectsData) {
      const { featuredProjects } = projectsData;
      setProjects(featuredProjects);
    }
  }, [projectsData]);

  const LoadingCards = () => (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );

  const projectCards = useMemo(
    () => (
      <>
        {projects.map((project: any) => {
          return <Card key={project.registrant_id} projectId={project.registrant_id} />;
        })}
      </>
    ),
    [projects],
  );

  return (
    <ContainerHeader>
      <Header>
        <Title>Featured projects</Title>
      </Header>

      <ProjectList>
        {projects.length === 0 || !projectsData || isLoading ? <LoadingCards /> : <>{projectCards}</>}
      </ProjectList>
      <OnBottom></OnBottom>
    </ContainerHeader>
  );
};

export default FeaturedProjects;
