import { Big, Near, Social, context, props } from "alem";
import { FollowContainer } from "./styles";

type Props = {
  accountId: string;
  classname?: string;
};

const FollowButton = ({ accountId, classname }: Props) => {
  if (!accountId || !context.accountId || context.accountId === accountId) {
    return "";
  }

  const followEdge = Social.keys(`${context.accountId}/graph/follow/${accountId}`, undefined, {
    values_only: true,
  });

  const inverseEdge = Social.keys(`${accountId}/graph/follow/${context.accountId}`, undefined, {
    values_only: true,
  });

  const loading = followEdge === null || inverseEdge === null;
  const follow = followEdge && Object.keys(followEdge).length;
  const inverse = inverseEdge && Object.keys(inverseEdge).length;

  const type = follow ? "unfollow" : "follow";

  const socialArgs = {
    data: {
      [context.accountId]: {
        graph: { follow: { [accountId]: follow ? null : "" } },
        index: {
          graph: JSON.stringify({
            key: "follow",
            value: {
              type,
              accountId: accountId,
            },
          }),
          notify: JSON.stringify({
            key: accountId,
            value: {
              type,
            },
          }),
        },
      },
    },
  };

  const buttonText = loading ? "Loading" : follow ? "Following" : inverse ? "Follow back" : "Follow";

  return (
    <FollowContainer
      className={classname || ""}
      onClick={() => {
        const transactions = [
          {
            contractName: "social.near",
            methodName: "set",
            deposit: Big(JSON.stringify(socialArgs).length * 0.00003).mul(Big(10).pow(24)),
            args: socialArgs,
          },
        ];
        Near.call(transactions);
      }}
    >
      {buttonText}
    </FollowContainer>
  );
};

export default FollowButton;
