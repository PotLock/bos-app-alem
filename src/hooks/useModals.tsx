import DonationModalProvider from "@app/contexts/DonationModalProvider";
import { useDonationModal } from "@app/hooks/useDonationModal";
import ModalDonation from "../modals/ModalDonation";
import ModalSuccess from "../modals/ModalSuccess/ModalSuccess";

/**
 * useModal hook. This is using DonationModalProvider and it's going to affect only
 * the level where it's being used. This is goot to avoid unnecessary re-render on other components
 * @returns
 */
const useModals = () => {
  DonationModalProvider();

  const { successfulDonation, donationModalProps } = useDonationModal();

  return () => (
    <>
      {successfulDonation && <ModalSuccess />}
      {donationModalProps && <ModalDonation />}
    </>
  );
};

export default useModals;
