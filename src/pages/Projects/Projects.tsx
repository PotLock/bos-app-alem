import Hero from "./components/Hero/Hero";
import FeaturedProjects from "./components/FeaturedProjects/FeaturedProjects";
import SearchBar from "./components/SearchBar/SearchBar";
// import ProjectsProvider from "../../contexts/ProjectsProvider";

const ProjectsPage = () => {
  const fakeCall = () => {};

  // NOTE: Usar o getProjects() service é mais performatico do ponto de vista de renderização pois
  // cada componente carrega para sí o dado necessário ao contrário de preencher uma camada acima com
  // dados de estado que causam um re-render em todos os componentes irmãos.
  //
  // O Uso de um Provider deve ser usado só quando realmente necessário. Prefira criar services!
  // ProjectsProvider();

  return (
    <>
      {/* TODO: ISSO ABAIXO QUEBRA */}
      {/* <Hero donateRandomlyClick={() => {}} /> */}
      <Hero donateRandomlyClick={fakeCall} />
      <FeaturedProjects />
      <SearchBar />
    </>
  );
};

export default ProjectsPage;
