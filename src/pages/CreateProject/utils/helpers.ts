import { asyncFetch, state } from "alem";
import { CATEGORY_MAPPINGS } from "./fields";

export const deepObjectDiff = (objOriginal: any, objUpdated: any) => {
  if (!objUpdated) objUpdated = {};
  let diff = {};

  function findDiff(original: any, updated: any, diffObj: any) {
    Object.keys(updated).forEach((key) => {
      const updatedValue = updated[key];
      const originalValue = original ? original[key] : undefined;

      // If both values are objects, recurse.
      if (
        typeof updatedValue === "object" &&
        updatedValue !== null &&
        (originalValue === undefined || (typeof originalValue === "object" && originalValue !== null))
      ) {
        const nestedDiff = originalValue ? findDiff(originalValue, updatedValue, {}) : updatedValue;
        if (Object.keys(nestedDiff).length > 0) {
          diffObj[key] = nestedDiff;
        }
      } else if (updatedValue !== originalValue) {
        // Direct comparison for string values.
        diffObj[key] = updatedValue;
      }
    });

    return diffObj;
  }

  return findDiff(objOriginal, objUpdated, diff);
};

export const uploadFileUpdateState = (body: any, callback: any) => {
  asyncFetch("https://ipfs.near.social/add", {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
  }).then(callback);
};

export const projectDisabled = () =>
  !state.profileImage ||
  !state.backgroundImage ||
  state.daoAddressError ||
  !state.name ||
  state.nameError ||
  !state.description ||
  state.descriptionError ||
  !state.publicGoodReason ||
  state.publicGoodReasonError ||
  (state.categories.includes(CATEGORY_MAPPINGS.OPEN_SOURCE) &&
    !Object.values(state.githubRepos).filter((val: any) => val[0]).length) ||
  (state.hasSmartContracts && !state.smartContracts.filter((val: any) => val[0]).length) ||
  (state.hasReceivedFunding && !state.fundingSources.length) ||
  !state.categories.length ||
  state.categoriesError;
