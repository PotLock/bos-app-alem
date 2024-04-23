import hrefWithParams from "@app/utils/hrefWithParams";
import Test from "./Test";
import { PotDetail } from "@app/types";
import Projects from "../NavPages/Projects/Projects";
import Applications from "../NavPages/Applications/Applications";

const dateNow = Date.now();

const navOptions: any = (potId: string, potDetail: PotDetail) => [
  {
    label: "Projects",
    id: "projects",
    disabled: false,
    source: Projects,
    href: hrefWithParams(`?tab=pot&potId=${potId}&nav=projects`),
  },
  {
    label: "Applications",
    id: "applications",
    disabled: false,
    source: (compProps: any) => <Applications {...compProps} />,
    href: hrefWithParams(`?tab=pot&potId=${potId}&nav=applications`),
  },
  {
    label: "Donations",
    id: "donations",
    disabled: false,
    source: Test,
    href: hrefWithParams(`?tab=pot&potId=${potId}&nav=donations`),
  },
  {
    label: "Sponsors",
    id: "sponsors",
    disabled: false,
    source: Test,
    href: hrefWithParams(`?tab=pot&potId=${potId}&nav=sponsors`),
  },
  {
    label: "Payouts",
    id: "payouts",
    disabled: dateNow < potDetail.public_round_start_ms, // TODO: ADD BACK IN
    source: Test,
    href: hrefWithParams(`?tab=pot&potId=${potId}&nav=payouts`),
  },
  {
    label: "Settings",
    id: "settings",
    disabled: false,
    source: Test,
    href: hrefWithParams(`?tab=pot&potId=${potId}&nav=settings`),
  },
];

export default navOptions;
