import { ModulesProvider } from "alem";
import Nav from "./components/Nav/Nav";
import Routes from "./routes/Routes";

const Main = () => {
  return (
    <>
      <ModulesProvider />
      <Nav />
      <div className="app-content">
        <Routes />
      </div>
    </>
  );
};

export default Main;
