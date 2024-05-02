// UserProvider.tsx
import { createContext } from "alem";

// Interface
export interface UserContextProps {
  setSuccessfulDonation: (newValue: any) => void;
  successfulDonation: any;
  donationModalProps: {
    projectId?: string;
    potId?: string;
    potDetail?: any;
    projects?: any;
    multiple?: boolean;
  } | null;
  setDonationModalProps: (newValue: any) => void;
}

const DonationModalProvider = () => {
  // Create a provider using a reference key
  const { setDefaultData, updateData, getSelf } = createContext<UserContextProps>("donation-modal");

  // const { successfulDonation, donationModalProps } = getSelf();

  setDefaultData({
    successfulDonation: null,
    donationModalProps: null,
    setSuccessfulDonation: (successfulDonation: any) => {
      updateData({
        successfulDonation,
        donationModalProps: null,
      });
    },
    setDonationModalProps: (donationModalProps: any) => {
      updateData({
        donationModalProps,
      });
    },
  });
  // console.log("test", successfulDonation);

  // return { successfulDonation, donationModalProps };
};

export default DonationModalProvider;
