import FollowTabs from "@app/pages/Profile/components/FollowTabs/FollowTabs";
import hrefWithParams from "../../../utils/hrefWithParams";
import Feed from "../../Project/NavPages/Feed/Feed";
import Donations from "../NavPages/Donations/Donations";

const donorOptions = (accountId: string) => [
  {
    label: "Social Feed",
    id: "feed",
    disabled: false,
    source: (componentProps: any) => <Feed {...componentProps} />,
    href: hrefWithParams(`?tab=profile&accountId=${accountId}&nav=feed`),
  },
  {
    label: "Donations",
    id: "donations",
    disabled: false,
    source: (componentProps: any) => <Donations {...componentProps} />,
    href: hrefWithParams(`?tab=profile&accountId=${accountId}&nav=donations`),
  },
  {
    label: "",
    id: "followers",
    disabled: false,
    source: (componentProps: any) => <FollowTabs {...componentProps} />,
  },
  {
    label: "",
    id: "following",
    disabled: false,
    source: (componentProps: any) => <FollowTabs {...componentProps} />,
  },
];

export default donorOptions;
