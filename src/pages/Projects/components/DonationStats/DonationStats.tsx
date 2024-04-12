import { useEffect, useState } from "alem";
import DonateSDK from "@app/SDK/donate";
import { Stats, StatsSubTitle, StatsTitle } from "./styles";
import yoctosToUsd from "@app/utils/yoctosToUsd";

const DonationStats = () => {
  const [donated, setDonated] = useState<string | null>(null);
  const [donations, setDonations] = useState<string | null>(null);

  const data = DonateSDK.getConfig();
  useEffect(() => {
    if (!donated) {
      const lastDonationAmount = data.net_donations_amount ? yoctosToUsd(data.net_donations_amount) : null;
      const totalDonations = data.total_donations_count;

      setDonated(lastDonationAmount);
      setDonations(totalDonations);
    }
  }, [data, donated]);

  return (
    <Stats>
      <StatsTitle>
        {donated || "-"}
        <StatsSubTitle>Donated</StatsSubTitle>
      </StatsTitle>
      <StatsTitle>
        {donations || "-"}
        <StatsSubTitle>Donations</StatsSubTitle>
      </StatsTitle>
    </Stats>
  );
};

export default DonationStats;
