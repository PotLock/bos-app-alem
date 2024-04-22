import FollowTabs from "@app/pages/Profile/components/FollowTabs/FollowTabs";
import hrefWithParams from "../../../utils/hrefWithParams";
import About from "../NavPages/About/About";
import Feed from "../NavPages/Feed/Feed";
import FundingRaised from "../NavPages/FundingRaised/FundingRaised";
import Pots from "../NavPages/Pots/Pots";

const ProjectOptions = (projectId: string) => [
  {
    label: "Home",
    id: "home",
    disabled: false,
    source: About,
    href: hrefWithParams(`?tab=project&projectId=${projectId}&nav=home`),
  },
  {
    label: "Social Feed",
    id: "feed",
    disabled: false,
    source: Feed,
    href: hrefWithParams(`?tab=project&projectId=${projectId}&nav=feed`),
  },
  {
    label: "Pots",
    id: "pots",
    disabled: false,
    source: (componentProps: any) => <Pots {...componentProps} />,
    href: hrefWithParams(`?tab=project&projectId=${projectId}&nav=pots`),
  },
  {
    label: "Funding Raised",
    id: "funding",
    disabled: false,
    source: (componentProps: any) => <FundingRaised {...componentProps} />,
    href: hrefWithParams(`?tab=project&projectId=${projectId}&nav=funding`),
  },
  {
    label: "",
    id: "followers",
    disabled: false,
    source: FollowTabs,
  },
  {
    label: "",
    id: "following",
    disabled: false,
    source: FollowTabs,
  },
];

export default ProjectOptions;
