import { ModulesProvider } from "alem";
import Nav from "./components/Nav/Nav";
import Routes from "./routes/Routes";
// import DonationsInfoProvider from "./contexts/DonationsInfoProvider";
import Banner from "./components/Banner/Banner";

const Main = () => {
  return (
    // <DonationsInfoProvider>
    <>
      <ModulesProvider />
      <Nav />
      <div className="app-content">
        <Routes />
      </div>
      <Banner />
    </>
    // </DonationsInfoProvider>
  );
};

export default Main;
