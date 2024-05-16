function deepEqual(obj1: any, obj2: any, keysToIgnore?: string[]): boolean {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1).filter((key) => !keysToIgnore?.includes(key));
  const keys2 = Object.keys(obj2).filter((key) => !keysToIgnore?.includes(key));

  // if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key], keysToIgnore)) return false;
  }

  return true;
}

export default deepEqual;
