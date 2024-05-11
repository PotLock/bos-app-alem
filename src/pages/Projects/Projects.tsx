import NewHero from "@app/components/NewHero/NewHero";
import AllProjects from "./components/AllProjects/AllProjects";
import FeaturedProjects from "./components/FeaturedProjects/FeaturedProjects";

const ProjectsPage = () => {
  return (
    <>
      <NewHero />
      <FeaturedProjects />
      <AllProjects />
    </>
  );
};

export default ProjectsPage;
