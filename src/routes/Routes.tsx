import { Router, createRoute } from "alem";
import Cart from "@app/pages/Cart/Cart";
import CreateProject from "@app/pages/CreateProject/CreateProject";
import DeployPot from "@app/pages/DeployPot/DeployPot";
import DonorPage from "@app/pages/Donor/Donor";
import FeedPage from "@app/pages/Feed";
import Leaderboard from "@app/pages/Leaderboard/Leaderboard";
import Pot from "@app/pages/Pot/Pot";
import PotsHome from "@app/pages/PotsHome/PotsHome";
import EditProfile from "@app/pages/Profile/Edit";
import ProjectPage from "@app/pages/Project/Project";
import ProjectsPage from "@app/pages/Projects/Projects";
import routesPath from "./routesPath";

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
  const CartRoute = createRoute(routesPath.CART_TAB, () => <Cart />);
  const CreateProjectRoute = createRoute(routesPath.CREATE_PROJECT_TAB, () => <CreateProject />);
  const EditProjectRoute = createRoute(routesPath.EDIT_PROJECT_TAB, () => <CreateProject />);

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
    CartRoute,
    CreateProjectRoute,
    EditProjectRoute,
  ];

  return <Router routes={routes} parameterName="tab" />;
};

export default Routes;
