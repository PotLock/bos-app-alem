import ProfileImage from "../mob.near/ProfileImage";
import { MembersListItem, MembersListItemLeft, MembersListItemText, RemoveMember } from "./styles";

type Props = {
  accountIds: string[];
  allowRemove?: boolean;
  handleRemoveAccount: (accountId: string) => void;
};

const AccountsList = (props: Props) => {
  const { accountIds, allowRemove, handleRemoveAccount } = props;

  return (
    <>
      {accountIds.map((accountId) => {
        return (
          <MembersListItem>
            <MembersListItemLeft>
              <ProfileImage
                {...{
                  accountId,
                  style: {
                    width: "40px",
                    height: "40px",
                    margin: "0 -8px 0 0",
                    borderRadius: "50%",
                    background: "white",
                  },
                  imageClassName: "rounded-circle w-100 h-100 d-block",
                  thumbnail: false,
                  tooltip: true,
                }}
              />

              <MembersListItemText>@{accountId}</MembersListItemText>
            </MembersListItemLeft>
            {allowRemove && <RemoveMember onClick={() => handleRemoveAccount(accountId)}>Remove</RemoveMember>}
          </MembersListItem>
        );
      })}
    </>
  );
};

export default AccountsList;
