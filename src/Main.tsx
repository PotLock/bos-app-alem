import { ModulesProvider, useParams } from "alem";
import Banner from "./components/Banner/Banner";
import Nav from "./components/Nav/Nav";
import { useDonationModal } from "./hooks/useDonationModal";
import ModalDonation from "./modals/ModalDonation";
import ModalSuccess from "./modals/ModalSuccess/ModalSuccess";
import Routes from "./routes/Routes";

const Main = () => {
  const { transactionHashes: _transactionHashes } = useParams();
  const { successfulDonation, donationModalProps } = useDonationModal();

  return (
    <>
      <ModulesProvider />
      <Nav />
      <div className="app-content">
        <Routes />
      </div>
      <Banner />
      {(successfulDonation || _transactionHashes) && <ModalSuccess />}
      {donationModalProps && <ModalDonation />}
    </>
  );
};

export default Main;
