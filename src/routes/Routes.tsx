import { Router, createRoute } from "alem";
import routesPath from "./routesPath";
import ProjectsPage from "../pages/Projects/Projects";
import ProjectPage from "../pages/Project/Project";

const Routes = () => {
  const ProjectsRoute = createRoute(routesPath.PROJECTS_LIST_TAB, () => <ProjectsPage />);
  const ProjectRoute = createRoute(routesPath.PROJECT_DETAIL_TAB, () => <ProjectPage />);
  const routes = [ProjectsRoute, ProjectRoute];

  return <Router routes={routes} parameterName="tab" />;
};

export default Routes;
