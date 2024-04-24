import { ModulesProvider } from "alem";
import Nav from "./components/Nav/Nav";
import Routes from "./routes/Routes";
// import DonationsInfoProvider from "./contexts/DonationsInfoProvider";

const Main = () => {
  return (
    // <DonationsInfoProvider>
    <>
      <ModulesProvider />
      <Nav />
      <div className="app-content">
        <Routes />
      </div>
    </>
    // </DonationsInfoProvider>
  );
};

export default Main;
