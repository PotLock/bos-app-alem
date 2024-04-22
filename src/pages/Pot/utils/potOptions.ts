import hrefWithParams from "@app/utils/hrefWithParams";
import Test from "./Test";

const navOptions = (potId: string) => [
  {
    label: "Projects",
    id: "projects",
    disabled: false,
    source: Test,
    href: hrefWithParams(`?tab=pot&potId=${potId}&nav=projects`),
  },
  // {
  //   label: "Applications",
  //   id: "applications",
  //   disabled: false,
  //   source: `${ownerId}/widget/Pots.Applications`,
  //   href: props.hrefWithParams(`?tab=pot&potId=${potId}&nav=applications`),
  // },
  // {
  //   label: "Donations",
  //   id: "donations",
  //   disabled: false,
  //   source: `${ownerId}/widget/Pots.Donations`,
  //   href: props.hrefWithParams(`?tab=pot&potId=${potId}&nav=donations`),
  // },
  // {
  //   label: "Sponsors",
  //   id: "sponsors",
  //   disabled: false,
  //   source: `${ownerId}/widget/Pots.Sponsors`,
  //   href: props.hrefWithParams(`?tab=pot&potId=${potId}&nav=sponsors`),
  // },
  // {
  //   label: "Payouts",
  //   id: "payouts",
  //   disabled: now < potDetail.public_round_start_ms, // TODO: ADD BACK IN
  //   source: `${ownerId}/widget/Pots.Payouts`,
  //   href: props.hrefWithParams(`?tab=pot&potId=${potId}&nav=payouts`),
  // },
  // {
  //   label: "Settings",
  //   id: "settings",
  //   disabled: false,
  //   source: `${ownerId}/widget/Pots.Settings`,
  //   href: props.hrefWithParams(`?tab=pot&potId=${potId}&nav=settings`),
  // },
];

export default navOptions;
