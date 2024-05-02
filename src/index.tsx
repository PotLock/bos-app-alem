import { RouterContext, loadExternalStyles } from "alem";
import Spinner from "./components/Spinner";

import Main from "./Main";
import CartProvider from "./contexts/CartProvider";
// import ProjectsProvider from "./contexts/ProjectsProvider";

const App = () => {
  const fontsLoaded = loadExternalStyles([
    "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap",
  ]);

  // Inject Projects Context/Provider: Similar to React's context, but it is a pure function.
  // ProjectsProvider();

  // const projects = useProjects();

  // if (!projects.isProjectsReady) {
  //   return <h3>Loading...</h3>;
  // }

  // const isRegistryAdmin = RegistrySDK.isRegistryAdmin(context.accountId);

  // console.log(isRegistryAdmin);
  RouterContext();
  CartProvider();
  return <div className="app-container">{fontsLoaded ? <Main /> : <Spinner />}</div>;
};

export default App;
