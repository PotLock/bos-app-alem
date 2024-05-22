import { Storage } from "alem";
import PotSDK from "@app/SDK/pot";
import { FlaggedAddress, Payout, PotApplication, PotDetail, PotDonation } from "@app/types";
import calculatePayouts from "@app/utils/calculatePayouts";

type UpdateState = (newValues: Partial<ProjectsState>) => void;

type GetPayoutProps = {
  potId: string;
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

const getPotData = (potId: string, property: string) => Storage.get(`${potId}-${property}`);

const setPotData = (potId: string, property: string, value: any) => Storage.set(`${potId}-${property}`, value);

// Get pot detail
export const getConfig = ({ potId, updateState }: { potId: string; updateState: UpdateState }) => {
  const potData = getPotData(potId, "config");
  const potDetail = potData?.potDetail;

  if (potDetail)
    updateState({
      potDetail,
    });

  PotSDK.asyncGetConfig(potId)
    .then((currentPotDetail: PotDetail) => {
      if (isEqual(potDetail, currentPotDetail)) return;
      else {
        setPotData(potId, "config", currentPotDetail);
        updateState({
          potDetail: currentPotDetail,
        });
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
  const potData = getPotData(potId, "projects");
  const savedProject = potData.projects || [];

  if (savedProject) {
    // if storage project exist show it
    let allProjects = savedProject;
    // Check if only approved applications is requested
    if (isApprpved) allProjects = allProjects.filter((project: PotApplication) => project.status === "Approved");
    updateState({
      projects: allProjects,
      filteredProjects: allProjects,
    });
  }
  // check the current projects
  PotSDK.asyncGetApprovedApplications(potId)
    .then((projects: PotApplication[]) => {
      if (projects.length === potData.projects?.length) return;
      setPotData(potId, "projects", projects);
      let allProjects = projects;
      if (isApprpved) allProjects = allProjects.filter((project: PotApplication) => project.status === "Approved");
      updateState({
        projects,
        filteredProjects: allProjects,
      });
    })
    .catch((error: unknown) => {
      updateState({
        projects: [],
        filteredProjects: [],
      });
    });
}

// get pot payouts
export const getPayout = ({ potId, allDonations, flaggedAddresses, potDetail, updateState }: GetPayoutProps) => {
  const potData = getPotData(potId, "payouts");
  const payouts = potData.payouts;
  if (payouts)
    updateState({
      payouts,
    });

  if (flaggedAddresses) {
    if (potDetail.payouts) {
      if (isEqual(potDetail.payouts, payouts)) return;
      else {
        setPotData(potId, "payouts", payouts);
        updateState({
          payouts,
        });
      }
    } else if (allDonations.length && flaggedAddresses)
      calculatePayouts(allDonations, potDetail.matching_pool_balance, flaggedAddresses).then((currentPayouts) => {
        if (isEqual(payouts, currentPayouts)) return;
        else {
          setPotData(potId, "payouts", currentPayouts);
          updateState({
            payouts: currentPayouts,
          });
        }
      });
    else if (allDonations?.length === 0 && flaggedAddresses?.length === 0) {
      updateState({
        payouts: {},
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
  updateState: (newValues: Partial<ProjectsState>) => void;
}) => {
  const potData = getPotData(potId, "donations");
  const donations = potData.donations || [];

  if (donations)
    updateState({
      donations,
    });

  if (potDetail.public_donations_count !== donations.length) {
    asyncGetPublicDonations(potDetail, potId).then((paginatedDonations) => {
      const currentDonations = paginatedDonations ? paginatedDonations.flat() : [];
      setPotData(potId, "donations", currentDonations);
      updateState({
        donations: currentDonations,
      });
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
  updateState: (newValues: Partial<ProjectsState>) => void;
  type: "list" | "obj";
}) => {
  const potData = getPotData(potId, "flaggedAccounts");
  let flaggedAddresses = potData.flaggedAddresses || [];

  if (type === "list") {
    flaggedAddresses = getListOfFlagged(flaggedAddresses);
  }
  updateState({
    flaggedAddresses,
  });

  PotSDK.getFlaggedAccounts(potDetail)
    .then((data) => {
      if (type === "list") {
        const liftOfFlagged = getListOfFlagged(data);
        if (liftOfFlagged.length === flaggedAddresses.length) return;
        else {
          setPotData(potId, "flaggedAccounts", data);
          updateState({
            flaggedAddresses: data,
          });
        }
      } else {
        const isNotEqual = data.some((adminFlaggedAcc: FlaggedAddress, idx: string) => {
          if (adminFlaggedAcc?.potFlaggedAcc?.length === adminFlaggedAcc?.potFlaggedAcc?.length) return false;
          else return true;
        });

        if (isNotEqual) {
          setPotData(potId, "flaggedAccounts", data);
          updateState({
            flaggedAddresses: data,
          });
        }
      }
    })
    .catch((err) => console.log("error getting the flagged accounts ", err));
};

// const allDonations = allDonationsPaginated ? allDonationsPaginated.flat() : null;

// const potOptions = {
//   potDetail: ({ potId }: { potId: string }) => PotSDK.asyncGetConfig(potId),
//   projects: ({ potId }: { potId: string }) => PotSDK.asyncGetApprovedApplications(potId),
//   sponsorshipDonations: ({ potId }: { potId: string }) => PotSDK.asyncGetMatchingPoolDonations(potId),
//   // need potDetail, flaggedAddresses, potDetail
//   payout: ({ allDonations, flaggedAddresses, potDetail }: GetPayoutProps) =>
//     getPayout({
//       allDonations,
//       flaggedAddresses,
//       potDetail,
//     }),
//   // need potDetail
//   flaggedAddresses: ({ potId, potDetail }: { potId: string; potDetail: PotDetail }) =>
//     PotSDK.getFlaggedAccounts(potDetail, potId),
//   donations: ({ potId, potDetail }: { potId: string; potDetail: PotDetail }) =>
//     asyncGetPublicDonations(potDetail, potId),
// };

// type PotDataOptions = "potDetail" | "payout" | "flaggedAddresses" | "projects" | "donations" | "sponsorshipDonations";

// export function getFlaggedAddresses({
//   potId,
//   optionsHandler,
//   updateState,
// }: {
//   potId: string;
//   optionsHandler: Record<PotDataOptions, (data: any) => any>;
//   updateState: (newValues: Partial<ProjectsState>) => void;
// }) {
//   // get pot Data from local storage
//   const potData: ProjectsState = JSON.parse(Storage.get(potId) || "{}");

//   const potDetail = potData.potDetail;
//   const donations = potData.donations;

//   const options = Object.keys(optionsHandler) as PotDataOptions[];

//   const needsPotDetail = ["payout", "donations", "flaggedAddresses"];
//   const needsAll = "payout";
//   // what is needed before fetching
//   let fetchFirst: Record<string, ""> = {};

//   options.forEach((option) => {
//     if (needsPotDetail.includes(option)) fetchFirst["potDetail"] = "";
//     if (needsAll === option) {
//       fetchFirst = {
//         potDetail: "",
//         donations: "",
//         flaggedAddresses: "",
//       };
//     }
//   });

//   if(
//     fetchFirst["potDetail"] &&
//   ){
//     PotSDK.asyncGetConfig(potId).then((potDetail:PotDetail)=>{

//     })
//   }

//   const promises = {};
//   const results = {};
//   options.forEach((option) => {
//     const result = potOptions[option]({});
//   });
// }
