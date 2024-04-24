import { useMemo } from "alem";
import { MoreAccountsContainer, MoreAccountsText, StackContainer } from "./styles";
import ProfileImage from "@app/components/mob.near/ProfileImage";

const AccountsStack = ({
  accountIds,
  maxDisplayCount,
  sendToBack,
}: {
  accountIds: string[];
  maxDisplayCount?: number;
  sendToBack: boolean;
}) => {
  const MAX_DISPLAY_COUNT = maxDisplayCount || 5;

  const accounts = useMemo(() => accountIds.slice(0, MAX_DISPLAY_COUNT), [accountIds]);

  return (
    <StackContainer>
      {accountIds.length > MAX_DISPLAY_COUNT && (
        <MoreAccountsContainer
          style={{
            zIndex: accountIds.length + 1,
          }}
        >
          <MoreAccountsText>{MAX_DISPLAY_COUNT}+</MoreAccountsText>
        </MoreAccountsContainer>
      )}
      {accounts.map((accountId: string, idx: number) => {
        return (
          <ProfileImage
            {...{
              accountId,
              style: {
                width: "28px",
                height: "28px",
                zIndex: sendToBack ? 0 : accountIds.length - idx,
                margin: "0 -8px 0 0",
                border: "2px solid white",
                borderRadius: "50%",
                background: "white",
              },
              className: "mb-2",
              imageClassName: "rounded-circle w-100 h-100 d-block",
              thumbnail: false,
              tooltip: true,
            }}
          />
        );
      })}
    </StackContainer>
  );
};

export default AccountsStack;
