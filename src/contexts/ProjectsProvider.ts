import { context, createContext, promisify, useContext } from "alem";
import RegistrySDK from "../SDK/registry";
import { Project } from "../types";

export type ProjectsContextProps = {
  isProjectsReady: boolean;
  allProjects: Project[];
  featuredProjects: Project[];

  /**
   * Set projects
   * @param projects
   * @param featuredProjects
   * @returns
   */
  setProjects: (projects: Project[], featuredProjects: Project[]) => void;

  /**
   * Fetch projects and update the context state
   * @returns
   */
  init: () => void;
};

const ProjectsProvider = () => {
  const { setDefaultData, updateData } = createContext<ProjectsContextProps>("projects-context");

  // Set default data
  setDefaultData({
    isProjectsReady: false,
    allProjects: [] as Project[],
    featuredProjects: [] as Project[],

    setProjects: (projects: Project[], featuredProjects: Project[]) => {
      updateData({ isProjectsReady: true, allProjects: projects, featuredProjects });
    },

    init: () => {
      const self = useContext<ProjectsContextProps>("projects-context");

      // Fetch data and update the context state
      if (self && !self.isProjectsReady) {
        const isRegistryAdmin = RegistrySDK.isRegistryAdmin(context.accountId);

        const setInitialData = (allProjects: Project[]) => {
          if (!isRegistryAdmin) {
            allProjects = allProjects.filter((project: any) => project.status === "Approved");
          } else {
            allProjects.sort((a: any, b: any) => b.submitted_ms - a.submitted_ms);
          }

          const featuredProjectIds = ["magicbuild.near", "potlock.near", "yearofchef.near"];

          const featuredProjects = allProjects.filter((project: any) => featuredProjectIds.includes(project.id));

          // Set projects
          self.setProjects(allProjects, featuredProjects);
        };

        // Promise
        promisify(
          () => RegistrySDK.getProjects(),
          (allProjects) => {
            // Success
            setInitialData(allProjects);
          },
          () => {
            // Error
            setInitialData([]);
          },
          1000,
        );
      }
    },
  });

  // Auto init
  const self = useContext<ProjectsContextProps>("projects-context");
  if (!self.isProjectsReady) {
    self.init();
  }
};

// Main context to be injected
export default ProjectsProvider;
