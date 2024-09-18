import { asyncFetch, useEffect, useState } from "alem";
import DonateSDK from "@app/SDK/donate";
import yoctosToUsdWithFallback from "@app/utils/yoctosToUsdWithFallback";
import { Stats, StatsSubTitle, StatsTitle } from "./styles";

// import { useDonationsInfo } from "@app/hooks/useDonationsInfo";

const DonationStats = () => {
  const [donated, setDonated] = useState<string | null>(null);
  const [donations, setDonations] = useState<string | null>(null);

  const data = DonateSDK.getConfig();

  const getDonations = () => {
    asyncFetch("https://dev.potlock.io/api/v1/stats", {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Allow-Origin": "*",
      },
    })
      .then((statesResponse) => {
        console.log("States response:", statesResponse);
        if (statesResponse.ok) {
          return statesResponse.json().then((states) => {
            const lastDonationAmount = states.total_payouts_usd;

            setDonations(states?.total_donors_count);
            setDonated(yoctosToUsdWithFallback(lastDonationAmount, true));
          });
        }
        // throw new Error("Failed to fetch states");
      })
      .catch((error) => {
        console.error("Error fetching states:", error);
      });
  };

  useEffect(() => {
    if (!donated) {
      const lastDonationAmount = data.net_donations_amount
        ? yoctosToUsdWithFallback(data.net_donations_amount, true)
        : null;
      const totalDonations = data.total_donations_count;

      setDonated(lastDonationAmount);
      setDonations(totalDonations);
    }
    getDonations();
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
