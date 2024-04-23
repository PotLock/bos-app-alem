import { useContext } from "alem";
import { DonationsInfoContextProps } from "@app/contexts/DonationsInfoProvider";

export const useDonationsInfo = () => useContext<DonationsInfoContextProps>("donationsInfo-context");
