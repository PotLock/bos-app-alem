import Hero from "@app/components/Hero/Hero";
import FeaturedProjects from "./components/FeaturedProjects/FeaturedProjects";
import SearchBar from "./components/SearchBar/SearchBar";
// import { useState } from "alem";
// import getProjects from "@app/services/getProjects";
// import ProjectsProvider from "../../contexts/ProjectsProvider";

const ProjectsPage = () => {
  // NOTE: Usar o getProjects() service é mais performatico do ponto de vista de renderização pois
  // cada componente carrega para sí o dado necessário ao contrário de preencher uma camada acima com
  // dados de estado que causam um re-render em todos os componentes irmãos.
  //
  // O Uso de um Provider deve ser usado só quando realmente necessário. Prefira criar services!
  // ProjectsProvider();

  return (
    <>
      <Hero />
      <FeaturedProjects />
      <SearchBar />
    </>
  );
};

export default ProjectsPage;
