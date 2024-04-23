import { Stats, StatsSubTitle, StatsTitle } from "./styles";
import { useDonationsInfo } from "@app/hooks/useDonationsInfo";

const DonationStats = () => {
  const { donated, donations } = useDonationsInfo();

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
