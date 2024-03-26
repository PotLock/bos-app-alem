import { useContext } from "alem";
import { ProjectsContextProps } from "../contexts/ProjectsProvider";

// Hook to access context props
export const useProjects = () => useContext<ProjectsContextProps>("projects-context");
