import { createContext } from "alem";
import DonateSDK from "@app/SDK/donate";
import yoctosToUsd from "@app/utils/yoctosToUsd";

export type DonationsInfoContextProps = {
  donated?: string;
  donations?: string;

  /**
   * Fetch donations data and update the state
   * @returns
   */
  fetchData: () => void;
};

const DonationsInfoContext = () => {
  const { setDefaultData, updateData, getSelf } = createContext<DonationsInfoContextProps>("donationsInfo-context");

  setDefaultData({
    donated: "",
    donations: "",
    fetchData: () => {
      if (!getSelf().donated) {
        const data = DonateSDK.getConfig();
        const lastDonationAmount = data.net_donations_amount ? yoctosToUsd(data.net_donations_amount) : "";
        const totalDonations = data.total_donations_count || "";

        updateData({ donated: lastDonationAmount, donations: totalDonations });
      }
    },
  });

  // Auto init
  const self = getSelf();
  if (!self.donated) {
    self.fetchData();
  }
};

type Props = {
  children?: React.ReactElement | React.ReactElement[];
};
const DonationsInfoProvider = ({ children }: Props) => {
  DonationsInfoContext();
  return children;
};

export default DonationsInfoProvider;
