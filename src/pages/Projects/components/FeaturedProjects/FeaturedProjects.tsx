import { State } from "alem";
import Card from "@app/components/Card/Card";
import useModals from "@app/hooks/useModals";
import getProjects from "@app/services/getProjects";
import CardSkeleton from "../CardSkeleton";
import { ContainerHeader, Header, OnBottom, ProjectList, Title } from "./styles";

const FeaturedProjects = () => {
  State.init({});
  const Modals = useModals();

  const { featuredProjects: projects } = getProjects();

  const LoadingCards = () => (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );

  const projectCards = projects
    ? projects.map((project: any) => {
        return <Card key={project.registrant_id} projectId={project.registrant_id} />;
      })
    : [];

  return (
    <ContainerHeader>
      <Modals />
      <Header>
        <Title>Featured projects</Title>
      </Header>

      <ProjectList>{projects.length === 0 || !projects ? <LoadingCards /> : <>{projectCards}</>}</ProjectList>
      <OnBottom></OnBottom>
    </ContainerHeader>
  );
};

export default FeaturedProjects;
