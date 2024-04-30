import { useEffect, useState } from "alem";
import DonateSDK from "@app/SDK/donate";
import { Stats, StatsSubTitle, StatsTitle } from "./styles";
import yoctosToUsdWithFallback from "@app/utils/yoctosToUsdWithFallback";
// import { useDonationsInfo } from "@app/hooks/useDonationsInfo";

const DonationStats = () => {
  const [donated, setDonated] = useState<string | null>(null);
  const [donations, setDonations] = useState<string | null>(null);

  const data = DonateSDK.getConfig();
  useEffect(() => {
    if (!donated) {
      const lastDonationAmount = data.net_donations_amount
        ? yoctosToUsdWithFallback(data.net_donations_amount, true)
        : null;
      const totalDonations = data.total_donations_count;

      setDonated(lastDonationAmount);
      setDonations(totalDonations);
    }
  }, [data, donated]);

  // const { donated, donations } = useDonationsInfo();

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
