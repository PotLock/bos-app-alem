import { Storage, useEffect, useState } from "alem";
import ListsSDK from "@app/SDK/lists";
import NewHero from "@app/components/NewHero/NewHero";
import AllProjects from "./components/AllProjects/AllProjects";
import FeaturedProjects from "./components/FeaturedProjects/FeaturedProjects";

const ProjectsPage = () => {
  // Use storage to improve project data availability.
  const PROJECTS_STORAGE_KEY = "previous-projects";
  const [projectsData, setProjectsData] = useState<any>(Storage.get(PROJECTS_STORAGE_KEY));

  useEffect(() => {
    ListsSDK.asyncGetRegistrations().then((allProjects: any) => {
      if (!allProjects) {
        return { allProjects: [], featuredProjects: [] };
      }

      allProjects.sort((a: any, b: any) => b.submitted_ms - a.submitted_ms);

      const featuredProjectIds = ["v1.foodbank.near", "potlock.near", "yearofchef.near"];

      const featuredProjects = allProjects.filter((project: any) => featuredProjectIds.includes(project.registrant_id));

      const approvedProjects = allProjects.filter((project: any) => project.status === "Approved");

      setProjectsData({ allProjects, approvedProjects, featuredProjects });
      Storage.set(PROJECTS_STORAGE_KEY, { allProjects, approvedProjects, featuredProjects });
    });
  }, []);

  return (
    <>
      <NewHero projectsData={projectsData} />
      <FeaturedProjects projectsData={projectsData} isLoading={!projectsData} />
      <AllProjects projectsData={projectsData} />
    </>
  );
};

export default ProjectsPage;
