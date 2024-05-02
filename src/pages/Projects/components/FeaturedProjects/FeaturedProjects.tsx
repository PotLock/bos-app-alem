import { useEffect, useMemo, useState } from "alem";
import Card from "@app/components/Card/Card";
import { ContainerHeader, Header, OnBottom, ProjectList, Title } from "./styles";
import { Project } from "@app/types";
import CardSkeleton from "../CardSkeleton";

const FeaturedProjects = ({ projectsData }: { projectsData: any }) => {
  const [projects, setProjects] = useState<Project[]>([]);

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
          return <Card projectId={project.registrant_id} />;
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

      <ProjectList>{projects.length === 0 ? <LoadingCards /> : <>{projectCards}</>}</ProjectList>
      <OnBottom></OnBottom>
    </ContainerHeader>
  );
};

export default FeaturedProjects;
