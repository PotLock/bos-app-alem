import { Storage } from "alem";
import ListsSDK from "@app/SDK/lists";
import { Project } from "@app/types";

const PROJECTS_STORAGE_KEY = "previous-projects";

type Data = {
  allProjects: Project[];
  approvedProjects: Project[];
  featuredProjects: Project[];
};

/**
 * Get current projects.
 * @returns
 */
const getProjects = () => {
  const allProjects = ListsSDK.getRegistrations();

  if (!allProjects) {
    return { allProjects: [], approvedProjects: [], featuredProjects: [] } as Data;
  }

  allProjects.sort((a: any, b: any) => b.submitted_ms - a.submitted_ms);

  const featuredProjectIds = ["v1.foodbank.near", "potlock.near", "yearofchef.near"];

  const featuredProjects = allProjects.filter((project: any) => featuredProjectIds.includes(project.registrant_id));

  const approvedProjects = allProjects.filter((project: any) => project.status === "Approved");

  const previousData = Storage.get(PROJECTS_STORAGE_KEY);

  if (previousData) {
    return previousData as Data;
  }

  Storage.set(PROJECTS_STORAGE_KEY, { allProjects, approvedProjects, featuredProjects });

  return { allProjects, approvedProjects, featuredProjects } as Data;
};

export default getProjects;
