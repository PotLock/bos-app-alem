import hrefWithParams from "../../../utils/hrefWithParams";
import Feed from "../../Project/NavPages/Feed/Feed";
import Donations from "../NavPages/Donations/Donations";

// TODO: Use SimpleRouter instead
const donorOptions = (accountId: string) => [
  {
    label: "Social Feed",
    id: "feed",
    disabled: false,
    source: Feed,
    href: hrefWithParams(`?tab=profile&accountId=${accountId}&nav=feed`),
  },
  {
    label: "Donations",
    id: "donations",
    disabled: false,
    source: Donations,
    href: hrefWithParams(`?tab=profile&accountId=${accountId}&nav=donations`),
  },
  // {
  //   label: "",
  //   id: "followers",
  //   disabled: false,
  //   source: `${ownerId}/widget/Profile.FollowTabs`,
  // },
  // {
  //   label: "",
  //   id: "following",
  //   disabled: false,
  //   source: `${ownerId}/widget/Profile.FollowTabs`,
  // },
];

export default donorOptions;
