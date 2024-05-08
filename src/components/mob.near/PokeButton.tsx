/**
 * https://near.org/near/widget/ComponentDetailsPage?src=mob.near/widget/PokeButton
 */
import { CommitButton, context } from "alem";
import ProfileImage from "./ProfileImage";

const PokeButton = (props: any) => {
  if (!props.accountId || !context.accountId || context.accountId === props.accountId) {
    return "";
  }

  const data = {
    index: {
      graph: JSON.stringify({
        key: "poke",
        value: {
          accountId: props.accountId,
        },
      }),
      notify: JSON.stringify({
        key: props.accountId,
        value: {
          type: "poke",
        },
      }),
    },
  };

  return (
    <CommitButton force className={`btn btn btn-dark text-nowrap rounded-5`} data={data}>
      <ProfileImage
        {...{
          accountId: props.accountId,
          style: { width: "1.5rem", height: "1.5rem" },
          imageClassName: "rounded-5 w-100 h-100 align-bottom",
        }}
      />
      <span role="img" aria-label="poke">
        👈
      </span>{" "}
      {props.back ? "Poke back" : "Poke"}
    </CommitButton>
  );
};

export default PokeButton;
