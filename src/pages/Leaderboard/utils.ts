import { Storage } from "alem";
import DonateSDK from "@app/SDK/donate";
import PotSDK from "@app/SDK/pot";
import PotFactorySDK from "@app/SDK/potfactory";

type UpdateState = (newValues: any) => void;

const getStorage = (property: string) => Storage.get(`${property}`);

const setStorage = (property: string, value: any) => Storage.set(`${property}`, value);

// Get Direct Donations
export const getDirectDoonations = (updateState: UpdateState) => {
  const key = "direct-donations";
  const limit = 900; // number of donations to fetch per req

  const savedDonations = getStorage(key);

  if (savedDonations) updateState(savedDonations);

  DonateSDK.asyncGetConfig().then(({ total_donations_count }) => {
    const paginations = [...Array(Math.ceil(total_donations_count / limit)).keys()];

    try {
      const allDonations = paginations.map((index) => DonateSDK.asyncGetDonations(limit * index, limit));

      Promise.all(allDonations).then((allDonationsPaginated) => {
        const donations = allDonationsPaginated.flat();
        if (donations.length !== savedDonations.length) {
          updateState(donations);
          setStorage(key, donations);
        }
      });
    } catch (error: any) {
      updateState([]);
      console.error(`error getting direct donations`, error);
    }
  });
};

// Get Sponsorship Donations
export const getSponsors = (updateState: UpdateState) => {
  const key = "sponsors";

  const savedDonations = getStorage(key);

  if (savedDonations) updateState(savedDonations);

  PotFactorySDK.asyncGetPots()
    .then((pots: any) => {
      if (pots) {
        const sponsors = pots.map(({ id }: any) => PotSDK.asyncGetMatchingPoolDonations(id));
        return Promise.all(sponsors).then((allSponsors) => {
          const sponsors = allSponsors.flat();

          sponsors.sort((a: any, b: any) => b.amount - a.amount);

          if (sponsors.length !== savedDonations.length) {
            updateState(sponsors);
            setStorage(key, sponsors);
          }
        });
      }
    })
    .catch((err: any) => {
      updateState([]);
      console.error(`error getting direct donations`, err);
    });
};

export const filterOptions = [
  { text: "All Time", value: "all" },
  { text: "1Y", value: "year" },
  { text: "1M", value: "month" },
  { text: "1W", value: "week" },
  { text: "24H", value: "day" },
];
