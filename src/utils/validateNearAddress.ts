const validateNearAddress = (address: string) => {
  const NEAR_ACCOUNT_ID_REGEX = /^(?=.{2,64}$)(?!.*\.\.)(?!.*-$)(?!.*_$)[a-z\d._-]+$/i;
  let isValid = NEAR_ACCOUNT_ID_REGEX.test(address);
  // Additional ".near" check for IDs less than 64 characters
  if (address.length < 64 && !address.endsWith(".near")) {
    isValid = false;
  }
  return isValid;
};

export default validateNearAddress;
