import { useContext } from "alem";
import { UserContextProps } from "@app/contexts/DonationModalProvider";

export const useDonationModal = () => useContext<UserContextProps>("donation-modal");
