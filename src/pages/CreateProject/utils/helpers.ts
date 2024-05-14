import { asyncFetch, context, state } from "alem";
import { CATEGORY_MAPPINGS, addressNamed } from "./fields";

export function isNamedAccount(accountId: string) {
  return addressNamed.some((substring) => accountId.includes(substring));
}

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
  (!state.isDao && !isNamedAccount(context.accountId || "")) ||
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
    !Object.values(state.githubRepos).filter(({ value, err }: any) => value && !err).length) ||
  (state.hasSmartContracts && !state.smartContracts.filter((val: any) => val[0]).length) ||
  (state.hasReceivedFunding && !state.fundingSources.length) ||
  !state.categories.length ||
  state.categoriesError;

export function extractRepoPath(url: string) {
  if (url) {
    // Define a regular expression pattern to match GitHub repository URLs
    const pattern = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+(?:\/[^\/]+)?)\/?$/;
    // Execute the regular expression on the URL
    const match = url.match(pattern);
    // If a match is found, return the extracted repository path; otherwise, return null
    return match
      ? {
          value: match[1],
          err: "",
        }
      : {
          value: url,
          err: "",
        };
  } else {
    return {
      value: "",
      err: "",
    };
  }
}
