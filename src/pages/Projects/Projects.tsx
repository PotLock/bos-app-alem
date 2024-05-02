import Hero from "@app/components/Hero/Hero";
import FeaturedProjects from "./components/FeaturedProjects/FeaturedProjects";
import AllProjects from "./components/AllProjects/AllProjects";
import { useState } from "alem";
import ListsSDK from "@app/SDK/lists";
import NewHero from "@app/components/NewHero/NewHero";

const ProjectsPage = () => {
  // NOTE: Usar o getProjects() service é mais performatico do ponto de vista de renderização pois
  // cada componente carrega para sí o dado necessário ao contrário de preencher uma camada acima com
  // dados de estado que causam um re-render em todos os componentes irmãos.
  //
  // O Uso de um Provider deve ser usado só quando realmente necessário. Prefira criar services!
  // ProjectsProvider();
  const [projectsData, setProjectsDate] = useState<any>(null);

  if (!projectsData) {
    ListsSDK.asyncGetRegistrations().then((allProjects: any) => {
      if (!allProjects) {
        return { allProjects: [], featuredProjects: [] };
      }

      allProjects.sort((a: any, b: any) => b.submitted_ms - a.submitted_ms);

      const featuredProjectIds = ["v1.foodbank.near", "potlock.near", "yearofchef.near"];

      const featuredProjects = allProjects.filter((project: any) => featuredProjectIds.includes(project.registrant_id));

      const approvedProjects = allProjects.filter((project: any) => project.status === "Approved");

      setProjectsDate({ allProjects, approvedProjects, featuredProjects });
    });
  }

  return (
    <>
      <NewHero projectsData={projectsData} />
      <FeaturedProjects projectsData={projectsData} />
      <AllProjects projectsData={projectsData} />
    </>
  );
};

export default ProjectsPage;
