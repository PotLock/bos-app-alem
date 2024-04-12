import { useEffect, useMemo, useState } from "alem";
import Card from "@app/components/Card/Card";
import { ContainerHeader, Header, OnBottom, ProjectList, Title } from "./styles";
import getProjects from "@app/services/getProjects";
import { Project } from "@app/types";
import CardSkeleton from "../CardSkeleton";

const FeaturedProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  // TODO: Criar um formato para o compilador saber quando é um arquivo
  // de custom hook e injetar no arquivo
  const projectsData = getProjects();
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
          return <Card projectId={project.id} allowDonate={true} />;
        })}
      </>
    ),
    [projects],
  );

  return (
    <ContainerHeader tab="">
      <Header>
        <Title>Featured projects</Title>
      </Header>

      <ProjectList>{projects.length === 0 ? <LoadingCards /> : <>{projectCards}</>}</ProjectList>
      <OnBottom></OnBottom>
    </ContainerHeader>
  );
};

export default FeaturedProjects;
