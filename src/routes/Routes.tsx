import { Router, createRoute } from "alem";
import routesPath from "./routesPath";
import ProjectsPage from "@app/pages/Projects/Projects";
import ProjectPage from "@app/pages/Project/Project";
import DonorPage from "@app/pages/Donor/Donor";
import EditProfile from "@app/pages/Profile/Edit";
import PotsHome from "@app/pages/PotsHome/PotsHome";
import Pot from "@app/pages/Pot/Pot";
import FeedPage from "@app/pages/Feed";

const Routes = () => {
  const ProjectsRoute = createRoute(routesPath.PROJECTS_LIST_TAB, () => <ProjectsPage />);
  const ProjectRoute = createRoute(routesPath.PROJECT_DETAIL_TAB, () => <ProjectPage />);
  const DonorRoute = createRoute(routesPath.PROFILE_TAB, () => <DonorPage />);
  const EditRoute = createRoute(routesPath.EDIT_PROFILE_TAB, () => <EditProfile />);
  const PotsHomeRoute = createRoute(routesPath.POTS_TAB, () => <PotsHome />);
  const PotRoute = createRoute(routesPath.POT_DETAIL_TAB, () => <Pot />);
  const FeedRoute = createRoute(routesPath.FEED_TAB, () => <FeedPage />);
  const routes = [ProjectsRoute, ProjectRoute, DonorRoute, EditRoute, PotsHomeRoute, PotRoute, FeedRoute];

  return <Router routes={routes} parameterName="tab" />;
};

export default Routes;
