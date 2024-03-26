import { loadExternalStyles } from "alem";
import Spinner from "./components/Spinner";
import Nav from "./components/Nav/Nav";
import Routes from "./routes/Routes";

const App = () => {
  const fontsLoaded = loadExternalStyles([
    "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap",
  ]);

  // Inject Projects Context/Provider: Similar to React's context, but it is a pure function.
  // ProjectsProvider();

  // const projects = useProjects();

  const AppContent = () => (
    <>
      <Nav />
      <div className="app-content">
        <Routes />
      </div>
    </>
  );

  return <div className="app-container">{fontsLoaded ? <AppContent /> : <Spinner />}</div>;
};

export default App;
