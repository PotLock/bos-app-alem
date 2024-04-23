import Compose from "./Compose";
import FilteredIndexFeed from "./PR/FilteredIndexFeed";
import ItemFeed from "./PR/ItemFeed";
import MergedIndexFeed from "./PR/MergedIndexFeed";

const Feed = (props: any) => {
  let { index, items, typeWhitelist, Item, Layout, showCompose, perPage } = props;
  Item = Item || ((props: any) => <div>{JSON.stringify(props)}</div>);
  Layout = Layout || (({ children }: any) => children);
  const renderItem = (a: any, i: number) => {
    if (typeWhitelist && !typeWhitelist.includes(a.value.type)) {
      return false;
    }
    return (
      <div key={JSON.stringify(a)}>
        <Item {...a} />
      </div>
    );
  };
  const composeIndex = () => {
    const arr = Array.isArray(index) ? index : [index];
    const grouped = arr.reduce((acc, i) => {
      if (i.action !== "repost") {
        if (!acc[i.action]) {
          acc[i.action] = [];
        }
        acc[i.action].push({ key: i.key, value: { type: "md" } });
      }
      return acc;
    }, {});
    Object.keys(grouped).forEach((action) => {
      if (grouped[action].length === 1) {
        grouped[action] = grouped[action][0];
      }
      grouped[action] = JSON.stringify(grouped[action]);
    });
    return grouped;
  };
  const appendHashtags = (v: any) => {
    const arr = Array.isArray(index) ? index : [index];
    const hashtags = arr.filter((i) => i.action === "hashtag").map((i) => i.key);
    hashtags.forEach((hashtag) => {
      if (v.toLowerCase().includes(`#${hashtag.toLowerCase()}`)) return;
      else v += ` #${hashtag}`;
    });
    return v;
  };
  if (items) {
    return (
      <ItemFeed
        {...{
          items,
          renderItem,
          perPage: perPage,
          Layout: ({ children }: any) => <Layout>{children}</Layout>,
        }}
      />
    );
  }
  return (
    <>
      {showCompose && <Compose {...{ index: composeIndex(), appendHashtags }} />}
      {Array.isArray(index) ? (
        <MergedIndexFeed
          {...{
            index,
            renderItem,
            Layout: ({ children }: any) => <Layout>{children}</Layout>,
          }}
        />
      ) : (
        <FilteredIndexFeed
          {...{
            index,
            renderItem,
            Layout: ({ children }: any) => <Layout>{children}</Layout>,
          }}
        />
      )}
    </>
  );
};

export default Feed;
