import { PotDetail } from "@app/types";
import hrefWithParams from "@app/utils/hrefWithParams";
import Applications from "../NavPages/Applications/Applications";
import Donations from "../NavPages/Donations/Donations";
import Payouts from "../NavPages/Payouts/Payouts";
import Projects from "../NavPages/Projects/Projects";
import Settings from "../NavPages/Settings/Settings";
import Sponsors from "../NavPages/Sponsors/Sponsors";
import Test from "./Test";

const dateNow = Date.now();

const navOptions: any = (potId: string, potDetail: PotDetail) => [
  {
    label: "Projects",
    id: "projects",
    disabled: false,
    source: (compProps: any) => <Projects {...compProps} />,
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
    source: (compProps: any) => <Donations {...compProps} />,
    href: hrefWithParams(`?tab=pot&potId=${potId}&nav=donations`),
  },
  {
    label: "Sponsors",
    id: "sponsors",
    disabled: false,
    source: (compProps: any) => <Sponsors {...compProps} />,
    href: hrefWithParams(`?tab=pot&potId=${potId}&nav=sponsors`),
  },
  {
    label: "Payouts",
    id: "payouts",
    disabled: dateNow < potDetail.public_round_start_ms, // TODO: ADD BACK IN
    source: (compProps: any) => <Payouts {...compProps} />,
    href: hrefWithParams(`?tab=pot&potId=${potId}&nav=payouts`),
  },
  {
    label: "Settings",
    id: "settings",
    disabled: false,
    source: (compProps: any) => <Settings {...compProps} />,
    href: hrefWithParams(`?tab=pot&potId=${potId}&nav=settings`),
  },
];

export default navOptions;
