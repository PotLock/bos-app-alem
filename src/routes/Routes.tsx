import { Router, createRoute } from "alem";
import routesPath from "./routesPath";
import ProjectsPage from "@app/pages/Projects/Projects";
import ProjectPage from "@app/pages/Project/Project";
import DonorPage from "@app/pages/Donor/Donor";
import EditProfile from "@app/pages/Profile/Edit";
import PotsHome from "@app/pages/PotsHome/PotsHome";
import Pot from "@app/pages/Pot/Pot";
import FeedPage from "@app/pages/Feed";
import DeployPot from "@app/pages/DeployPot/DeployPot";
import ConfigForm from "@app/pages/Pot/NavPages/ConfigForm/ConfigForm";
import Leaderboard from "@app/pages/Leaderboard/Leaderboard";

const Routes = () => {
  const ProjectsRoute = createRoute(routesPath.PROJECTS_LIST_TAB, () => <ProjectsPage />);
  const ProjectRoute = createRoute(routesPath.PROJECT_DETAIL_TAB, () => <ProjectPage />);
  const DonorRoute = createRoute(routesPath.PROFILE_TAB, () => <DonorPage />);
  const EditRoute = createRoute(routesPath.EDIT_PROFILE_TAB, () => <EditProfile />);
  const PotsHomeRoute = createRoute(routesPath.POTS_TAB, () => <PotsHome />);
  const PotRoute = createRoute(routesPath.POT_DETAIL_TAB, () => <Pot />);
  const FeedRoute = createRoute(routesPath.FEED_TAB, () => <FeedPage />);
  const DeployPotRoute = createRoute(routesPath.DEPLOY_POT_TAB, () => <DeployPot />);
  const LeaderboardRoute = createRoute(routesPath.DONORS_TAB, () => <Leaderboard />);
  const routes = [
    ProjectsRoute,
    ProjectRoute,
    DonorRoute,
    EditRoute,
    PotsHomeRoute,
    PotRoute,
    FeedRoute,
    DeployPotRoute,
    LeaderboardRoute,
  ];

  return <Router routes={routes} parameterName="tab" />;
};

export default Routes;
