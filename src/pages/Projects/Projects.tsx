import NewHero from "@app/components/NewHero/NewHero";
import AllProjects from "./components/AllProjects/AllProjects";
import FeaturedProjects from "./components/FeaturedProjects/FeaturedProjects";

const ProjectsPage = () => {
  // TODO: Além -> Gerar o erro
  // 1 - Comenta a linha 39 e inicia o projeto
  // 2 - Descomenta a linha 39, vai gerar o erro

  return (
    <>
      <NewHero />
      <FeaturedProjects />
      <AllProjects />
    </>
  );
};

export default ProjectsPage;
