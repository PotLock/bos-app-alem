import PotSDK from "@app/SDK/pot";
import { PotDetail } from "@app/types";

export const getPotDonations = (
  potId: string,
  potDetail: PotDetail,
  accountId: string,
  potDonations: any,
  setPotDonations: any,
) => {
  return PotSDK.asyncGetDonationsForDonor(potId, accountId)
    .then((donations: any) => {
      donations = donations.filter((donations: any) => donations.donor_id === accountId);
      const updatedDonations = donations.map((donation: any) => ({
        ...donation,
        base_currency: potDetail.base_currency,
        pot_name: potDetail.pot_name,
        pot_id: potId,
        type: donation.project_id ? "matched" : "sponsorship",
      }));
      if (potDonations[potId]) return "";
      setPotDonations((prevpotDonations: any) => {
        return { ...prevpotDonations, [potId]: updatedDonations };
      });
    })
    .catch(() => {
      if (potDonations[potId]) return "";
      setPotDonations((prevpotDonations: any) => {
        return { ...prevpotDonations, [potId]: [] };
      });
    });
};

export const searchDonations = (searchTerm: string, totalDonations: any) => {
  const filteredApplications = totalDonations.filter((item: any) => {
    const searchIn = [
      item.pot_name || "",
      item.recipient_id || "",
      item.project_id || "",
      item.donor_id || "",
      item.pot_id || "",
    ];
    return searchIn.some((item) => item.toLowerCase().includes(searchTerm.toLowerCase()));
  });
  return filteredApplications;
};

export const filterDonations = (sortVal: string, sortList: any, search: string, totalDonations: any) => {
  const displayedDonations = searchDonations(search, totalDonations);
  let filtered;
  if (sortVal && sortVal !== "all") {
    filtered = displayedDonations.filter((donation: any) => {
      return sortList[donation.type].val === sortVal;
    });
    return filtered;
  } else {
    return displayedDonations;
  }
};

export const getName = (donation: any) => {
  switch (donation.type) {
    case "direct":
      return donation.recipient_id;
    case "sponsorship":
      return donation.pot_name;
    case "payout":
      return donation.pot_name;
    case "matched":
      return donation.project_id;
    default:
      return donation.recipient_id;
  }
};

export const addTrailingZeros = (number: number) => {
  if (number < 100 && number >= 0.1) return number.toFixed(1);
  return number;
};
