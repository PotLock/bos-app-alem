import ListsSDK from "@app/SDK/lists";

/**
 * Get current projects.
 * @returns
 */
const getProjects = () => {
  const allProjects = ListsSDK.getRegistrations();

  if (!allProjects) {
    return { allProjects: [], featuredProjects: [] };
  }

  allProjects.sort((a: any, b: any) => b.submitted_ms - a.submitted_ms);

  const featuredProjectIds = ["v1.foodbank.near", "potlock.near", "yearofchef.near"];

  const featuredProjects = allProjects.filter((project: any) => featuredProjectIds.includes(project.registrant_id));

  return { allProjects, featuredProjects };
};

export default getProjects;
