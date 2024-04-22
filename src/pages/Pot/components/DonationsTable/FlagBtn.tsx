import { Big, Near, context, useParams } from "alem";
import { Flag } from "./styles";

const FlagBtn = ({
  isFlagged,
  isProject,
  address,
  setUpdateFlaggedAddresses,
  updateFlaggedAddresses,
  setFlagAddress,
}: any) => {
  const accountId: any = context.accountId;

  const { potId } = useParams();

  const handleFlag = (e: any, address: any, isFlagged: any) => {
    const SOCIAL_CONTRACT_ID = "social.near";

    e.preventDefault();
    if (isFlagged) {
      // remove flagged account
      // get latest pLBlacklistedAccounts updates
      Near.asyncView(SOCIAL_CONTRACT_ID, "get", {
        keys: [`${accountId}/profile/**`],
      }).then((profileData) => {
        const profile = profileData[accountId].profile;

        const pLBlacklistedAccounts = JSON.parse(profile.pLBlacklistedAccounts || "{}");
        const potFlaggedAcc = pLBlacklistedAccounts[potId] || {};
        delete potFlaggedAcc[address];

        const socialArgs = {
          data: {
            [accountId]: {
              profile: {
                pLBlacklistedAccounts: JSON.stringify({
                  ...pLBlacklistedAccounts,
                  [potId]: {
                    ...potFlaggedAcc,
                  },
                }),
              },
            },
          },
        };
        const depositFloat = JSON.stringify(socialArgs).length * 0.00015;

        const socialTransaction = {
          contractName: SOCIAL_CONTRACT_ID,
          methodName: "set",
          args: socialArgs,
          deposit: Big(depositFloat).mul(Big(10).pow(24)),
        };
        Near.call(socialTransaction);

        // update flaggedAddresses
        // TODO: check if it is successful before the update
        setTimeout(() => {
          setUpdateFlaggedAddresses(!updateFlaggedAddresses);
        }, 3000);
      });
    } else {
      // open flagModal
      setFlagAddress(address);
    }
  };

  return isFlagged && accountId === isFlagged.flaggedBy ? (
    <Flag className="flag" onClick={(e) => handleFlag(e, address, isFlagged)}>
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7.86 2.5L8.26 4.5H13.5V10.5H10.14L9.74 8.5H2.5V2.5H7.86ZM9.5 0.5H0.5V17.5H2.5V10.5H8.1L8.5 12.5H15.5V2.5H9.9L9.5 0.5Z"
          fill="#7B7B7B"
        />
      </svg>
      <div>Unflag {isProject ? "project" : "donor"}</div>
    </Flag>
  ) : (
    <Flag className="flag" onClick={(e) => handleFlag(e, address, isFlagged)}>
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7.86 2.5L8.26 4.5H13.5V10.5H10.14L9.74 8.5H2.5V2.5H7.86ZM9.5 0.5H0.5V17.5H2.5V10.5H8.1L8.5 12.5H15.5V2.5H9.9L9.5 0.5Z"
          fill="#7B7B7B"
        />
      </svg>
      <div>Flag {isProject ? "project" : "donor"}</div>
    </Flag>
  );
};

export default FlagBtn;
