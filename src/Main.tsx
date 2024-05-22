import { ModulesProvider, useParams } from "alem";
import Banner from "./components/Banner/Banner";
import Nav from "./components/Nav/Nav";
import ModalSuccess from "./modals/ModalSuccess/ModalSuccess";
import Routes from "./routes/Routes";

const Main = () => {
  const { transactionHashes } = useParams();

  return (
    <>
      <ModulesProvider />
      <Nav />
      <div className="app-content">
        <Routes />
      </div>
      <Banner />
      {transactionHashes && <ModalSuccess />}
    </>
  );
};

export default Main;
