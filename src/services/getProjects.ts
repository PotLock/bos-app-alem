import { context } from "alem";
import RegistrySDK from "../SDK/registry";
import { Project } from "../types";

/**
 * Get current projects.
 * @returns
 */
const getProjects = () => {
  const isRegistryAdmin = RegistrySDK.isRegistryAdmin(context.accountId);

  let allProjects = RegistrySDK.getProjects() as Project[];

  if (!allProjects) {
    return { allProjects: [], featuredProjects: [] };
  }

  if (!isRegistryAdmin) {
    allProjects = allProjects.filter((project) => project.status === "Approved");
  } else {
    allProjects.sort((a, b) => b.submitted_ms - a.submitted_ms);
  }

  const featuredProjectIds = ["magicbuild.near", "potlock.near", "yearofchef.near"];

  const featuredProjects = allProjects.filter((project) => featuredProjectIds.includes(project.id));

  return { allProjects, featuredProjects };
};

export default getProjects;
