import { Social, context } from "alem";
import IndexFeed from "./IndexFeed";

const FilteredIndexFeed = (props: any) => {
  const filter = context.accountId && {
    ignore: Social.getr(`${context.accountId}/graph/hide`),
  };

  return <IndexFeed {...{ filter, ...props }} />;
};

export default FilteredIndexFeed;
