import { ModulesProvider } from "alem";
import Banner from "./components/Banner/Banner";
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
      <Banner />
    </>
  );
};

export default Main;
