import { Storage } from "alem";
import PotSDK from "@app/SDK/pot";
import { FlaggedAddress, Payout, PotApplication, PotDetail, PotDonation, CalculatedPayout } from "@app/types";
import calculatePayouts from "@app/utils/calculatePayouts";

// type UpdateState = (newValues: Partial<ProjectsState>) => void;
type UpdateState = (newValues: any) => void;

type GetPayoutProps = {
  potId: string;
  withTotalAmount: boolean;
  allDonations: PotDonation[];
  flaggedAddresses: FlaggedAddress[];
  potDetail: PotDetail;
  updateState: UpdateState;
};

export type ProjectsState = {
  potDetail?: PotDetail;
  donations?: PotDonation[];
  filteredProjects?: PotApplication[];
  projects?: PotApplication[] | null;
  flaggedAddresses?: FlaggedAddress[] | null;
  payouts?: Record<string, Payout> | null;
};

function isEqual(obj1: any, obj2: any) {
  // Check if both are the same reference
  if (obj1 === obj2) return true;

  // Check if both are null or undefined
  if (obj1 == null || obj2 == null) return false;

  // Check if both are not objects (e.g., numbers, strings, etc.)
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;

  // Get the keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if both objects have the same number of keys
  if (keys1.length !== keys2.length) return false;

  // Check if all keys and their values are the same
  for (const key of keys1) {
    if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

function isObjectEqual(obj1: CalculatedPayout, obj2: CalculatedPayout): boolean {
  return obj1.project_id === obj2.project_id && obj1.amount === obj2.amount;
}

function areListsEqual(list1: CalculatedPayout[], list2: CalculatedPayout[]): boolean {
  // Check if both lists have the same length
  if (list1.length !== list2.length) {
    return false;
  }

  // Check if all objects in the lists are equal
  for (let i = 0; i < list1.length; i++) {
    if (!isObjectEqual(list1[i], list2[i])) {
      return false;
    }
  }

  // If no differences are found, return true
  return true;
}

const getPotData = (potId: string, property: string) => Storage.get(`${potId}-${property}`);

const setPotData = (potId: string, property: string, value: any) => Storage.set(`${potId}-${property}`, value);

// Get pot detail
export const getConfig = ({ potId, updateState }: { potId: string; updateState: UpdateState }) => {
  const potDetail = getPotData(potId, "config");

  if (potDetail) updateState(potDetail);

  PotSDK.asyncGetConfig(potId)
    .then((currentPotDetail: PotDetail) => {
      if (isEqual(potDetail, currentPotDetail)) return;
      else {
        setPotData(potId, "config", currentPotDetail);
        updateState(currentPotDetail);
      }
    })
    .catch((err: unknown) => {
      console.log("error getthing pot config ", err);
    });
};

// get pot applications
export function getPotProjects({
  potId,
  updateState,
  isApprpved,
}: {
  potId: string;
  updateState: UpdateState;
  isApprpved: boolean;
}) {
  // get projects from local storage
  const savedProject = getPotData(potId, "projects");

  if (savedProject) {
    // if storage project exist show it
    let allProjects = savedProject;
    // Check if only approved applications is requested
    if (isApprpved) allProjects = allProjects.filter((project: PotApplication) => project.status === "Approved");
    updateState(allProjects);
  }
  // check the current projects
  PotSDK.asyncGetApplications(potId)
    .then((projects: PotApplication[]) => {
      if (projects.length === savedProject?.length) return;
      setPotData(potId, "projects", projects);
      let allProjects = projects;
      if (isApprpved) allProjects = allProjects.filter((project: PotApplication) => project.status === "Approved");
      updateState(allProjects);
    })
    .catch((error: unknown) => {
      console.log("error fetching pot applications ", error);

      updateState([]);
    });
}

// get pot payouts
export const getPayout = ({
  potId,
  allDonations,
  flaggedAddresses,
  potDetail,
  withTotalAmount, // true => return object false=> return false
  updateState,
}: GetPayoutProps) => {
  const storageKey = withTotalAmount ? "payouts-obj" : "payouts";

  const flaggedLength = flaggedAddresses.length;
  const allDonationsLength = allDonations.length;

  const potData = getPotData(potId, storageKey);

  const payouts = potData?.payouts;
  const storedFlaggedLength = potData?.flaggedLength;
  const storedAllDonationsLength = potData?.allDonationsLength;

  // limit payment calculations by checking the calculatePayouts params
  const isEqualStored = flaggedLength === storedFlaggedLength && storedAllDonationsLength === allDonationsLength;

  if (payouts) updateState(payouts);

  if (!isEqualStored || payouts.length === 0) {
    if (potDetail.payouts.length && !withTotalAmount) {
      const sortedPayouts = potDetail.payouts;
      sortedPayouts.sort((a: any, b: any) => b.amount - a.amount);
      setPotData(potId, storageKey, {
        payouts: sortedPayouts,
        flaggedLength,
        allDonationsLength,
      });
      updateState(sortedPayouts);
    } else if (allDonations?.length === 0 && flaggedAddresses?.length === 0) {
      updateState([]);
    } else if (allDonations && flaggedAddresses) {
      calculatePayouts(allDonations, potDetail.matching_pool_balance, flaggedAddresses).then((calculatedPayouts) => {
        const currentPayouts =
          potDetail.payouts.length > 0
            ? potDetail.payouts.map((payout: Payout) => ({
                ...payout,
                donorCount: calculatedPayouts[payout.project_id].donorCount,
                totalAmount: calculatedPayouts[payout.project_id].totalAmount,
              }))
            : Object.entries(calculatedPayouts).map(
                ([projectId, { matchingAmount, donorCount, totalAmount }]: any) => ({
                  project_id: projectId,
                  amount: matchingAmount,
                  donorCount,
                  totalAmount,
                }),
              );
        currentPayouts.sort((a: any, b: any) => b.amount - a.amount);

        setPotData(potId, storageKey, {
          payouts: currentPayouts,
          flaggedLength,
          allDonationsLength,
        });
        updateState(currentPayouts);
      });
    }
  }
};

// get matched donations
export const asyncGetPublicDonations = (potDetail: PotDetail, potId: string) => {
  const limit = 480; // number of donations to fetch per req

  const donationsCount = potDetail.public_donations_count;
  const paginations = [...Array(Math.ceil(donationsCount / limit)).keys()];

  try {
    const allDonations = paginations.map((index) =>
      PotSDK.asyncGetPublicRoundDonations(potId, {
        from_index: index * limit,
        limit: limit,
      }),
    );

    return Promise.all(allDonations);
  } catch (error) {
    console.error(`error getting public donations`, error);
    return Promise.all([]);
  }
};

export const getDonations = ({
  potId,
  potDetail,
  updateState,
}: {
  potId: string;
  potDetail: PotDetail;
  updateState: UpdateState;
}) => {
  const donations = getPotData(potId, "donations");

  if (donations) updateState(donations);

  if (potDetail.public_donations_count !== donations?.length) {
    asyncGetPublicDonations(potDetail, potId).then((paginatedDonations) => {
      const currentDonations = paginatedDonations ? paginatedDonations.flat() : [];
      currentDonations.reverse();
      setPotData(potId, "donations", currentDonations);
      updateState(currentDonations);
    });
  }
};

const getListOfFlagged = (flaggedAddresses: FlaggedAddress[]) => {
  const listOfFlagged: any = [];
  flaggedAddresses.forEach((adminFlaggedAcc: any) => {
    const addresses = Object.keys(adminFlaggedAcc.potFlaggedAcc);
    listOfFlagged.push(...addresses);
  });
  return listOfFlagged;
};

export const getFlaggedAccounts = ({
  potId,
  potDetail,
  updateState,
  type,
}: {
  potId: string;
  potDetail: PotDetail;
  updateState: UpdateState;
  type: "list" | "obj";
}) => {
  const flaggedAddresses = getPotData(potId, "flaggedAccounts") || [];

  const saveListOfFlagged = getListOfFlagged(flaggedAddresses);

  if (type === "list") {
    updateState(saveListOfFlagged);
  } else {
    updateState(flaggedAddresses);
  }

  PotSDK.getFlaggedAccounts(potDetail, potId)
    .then((data) => {
      const liftOfFlagged = getListOfFlagged(data);

      if (liftOfFlagged.length !== saveListOfFlagged.length) {
        if (type === "list") {
          setPotData(potId, "flaggedAccounts", data);
          updateState(data);
        } else {
          setPotData(potId, "flaggedAccounts", data);
          updateState(data);
        }
      }
    })
    .catch((err) => console.log("error getting the flagged accounts ", err));
};

export const getSponsorships = ({ potId, updateState }: { potId: string; updateState: UpdateState }) => {
  const sponsors = getPotData(potId, "sponsors");

  if (sponsors) updateState(sponsors);

  PotSDK.asyncGetMatchingPoolDonations(potId)
    .then((sponsorshipDonations: PotDonation[]) => {
      sponsorshipDonations.sort((a: any, b: any) => b.net_amount - a.net_amount);
      if (sponsors?.length === sponsorshipDonations?.length) return;
      else {
        updateState(sponsorshipDonations);
        setPotData(potId, "sponsors", sponsorshipDonations);
      }
    })
    .catch((err: unknown) => {
      console.log("error fetching sponsors ", err);
      updateState([]);
    });
};
