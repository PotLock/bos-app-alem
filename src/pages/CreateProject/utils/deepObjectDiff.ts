const deepObjectDiff = (objOriginal: any, objUpdated: any) => {
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

export default deepObjectDiff;
