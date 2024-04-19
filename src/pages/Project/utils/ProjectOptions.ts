import hrefWithParams from "../../../utils/hrefWithParams";
import About from "../NavPages/About/About";
import Feed from "../NavPages/Feed/Feed";

// TODO: Use SimpleRouter instead
const ProjectOptions = (projectId: string) => [
  {
    label: "Home",
    id: "home",
    disabled: false,
    // source: `${ownerId}/widget/Project.About`,
    source: About,
    href: hrefWithParams(`?tab=project&projectId=${projectId}&nav=home`),
  },
  {
    label: "Social Feed",
    id: "feed",
    disabled: false,
    // source: `${ownerId}/widget/Profile.Feed`,
    source: Feed,
    href: hrefWithParams(`?tab=project&projectId=${projectId}&nav=feed`),
  },
  {
    label: "Pots",
    id: "pots",
    disabled: false,
    // source: `${ownerId}/widget/Project.Pots`,
    source: About,
    href: hrefWithParams(`?tab=project&projectId=${projectId}&nav=pots`),
  },
  // {
  //   label: "Attestations",
  //   id: "attestations",
  //   disabled: true,
  // },
  {
    label: "Funding Raised",
    id: "funding",
    disabled: false,
    // source: `${ownerId}/widget/Project.FundingRaised`,
    source: About,
    href: hrefWithParams(`?tab=project&projectId=${projectId}&nav=funding`),
  },
  {
    label: "",
    id: "followers",
    disabled: false,
    // source: `${ownerId}/widget/Profile.FollowTabs`,
    source: About,
  },
  {
    label: "",
    id: "following",
    disabled: false,
    // source: `${ownerId}/widget/Profile.FollowTabs`,
    source: About,
  },
];

export default ProjectOptions;
