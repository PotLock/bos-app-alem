// UserProvider.tsx
import { createContext } from "alem";

// Interface
interface UserContextProps {
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
  // test: "test";
  // transactionHashes: null | string;
  // setTransactionHashes: (newValue: any) => void;
}

const DonationModalProvider = () => {
  // Create a provider using a reference key
  const { setDefaultData, updateData, getSelf } = createContext<UserContextProps>("donation-modal");

  const self = getSelf();

  setDefaultData({
    successfulDonation: null,
    donationModalProps: null,
    // test: "test",
    // transactionHashes: null,
    // setTransactionHashes: (transactionHashes: any) => {
    //   updateData({
    //     transactionHashes,
    //   });
    // },
    setSuccessfulDonation: (successfulDonation: any) => {
      updateData({
        successfulDonation,
      });
    },
    setDonationModalProps: (donationModalProps: any) => {
      updateData({
        donationModalProps,
      });
    },
  });

  return self;
};

export default DonationModalProvider;
