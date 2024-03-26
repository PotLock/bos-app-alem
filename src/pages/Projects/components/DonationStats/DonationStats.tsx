import { Stats, StatsSubTitle, StatsTitle } from "./styles";
import DonateSDK from "../../../../SDK/donate";
import yoctosToUsd from "../../../../utils/yoctosToUsd";

const DonationStats = () => {
  const data = DonateSDK.getConfig();
  const lastDonationAmount = data.net_donations_amount ? yoctosToUsd(data.net_donations_amount) : null;
  const totalDonations = data.total_donations_count;

  return (
    <Stats>
      <StatsTitle>
        {lastDonationAmount || "-"}
        <StatsSubTitle>Donated</StatsSubTitle>
      </StatsTitle>
      <StatsTitle>
        {totalDonations || "-"}
        <StatsSubTitle>Donations</StatsSubTitle>
      </StatsTitle>
    </Stats>
  );
};

export default DonationStats;
