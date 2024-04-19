import { State, props, state } from "alem";
import DonateSDK from "@app/SDK/donate";
import constants from "@app/constants";
import basisPointsToPercent from "@app/utils/basisPointsToPercent";
import {
  BreakdownAmount,
  BreakdownItem,
  BreakdownItemLeft,
  BreakdownItemRight,
  BreakdownSummaryContent,
  BreakdownTitle,
  Header,
  Icon,
} from "./styles";
import NearIcon from "@app/assets/svgs/near-icon";

const BreakdownSummary = ({
  referrerId,
  totalAmount,
  bypassProtocolFee,
  recipientId,
  potRferralFeeBasisPoints,
  ftIcon,
  bypassChefFee,
  chef,
  chefFeeBasisPoints,
}: any) => {
  const donationContractConfig = DonateSDK.getConfig();

  State.init({
    showBreakdown: true,
  });

  if (!donationContractConfig) return "";

  const { protocol_fee_basis_points } = donationContractConfig;

  const protocolFeeBasisPoints = props.protocolFeeBasisPoints ?? protocol_fee_basis_points;
  const referralFeeBasisPoints = potRferralFeeBasisPoints || props.referralFeeBasisPoints;

  const TOTAL_BASIS_POINTS = 10_000;
  let projectAllocationBasisPoints =
    TOTAL_BASIS_POINTS -
    (bypassProtocolFee || !protocolFeeBasisPoints ? 0 : protocolFeeBasisPoints) -
    (bypassChefFee || !chefFeeBasisPoints ? 0 : chefFeeBasisPoints);
  if (referrerId) {
    projectAllocationBasisPoints -= referralFeeBasisPoints;
  }
  const projectAllocationPercent = basisPointsToPercent(projectAllocationBasisPoints);
  const projectAllocationAmount = (parseFloat(totalAmount) * projectAllocationBasisPoints) / TOTAL_BASIS_POINTS;
  const protocolFeePercent = basisPointsToPercent(protocolFeeBasisPoints);
  const protocolFeeAmount = (parseFloat(totalAmount) * protocolFeeBasisPoints) / TOTAL_BASIS_POINTS;
  const referrerFeePercent = basisPointsToPercent(referralFeeBasisPoints);
  const referrerFeeAmount = (parseFloat(totalAmount) * referralFeeBasisPoints) / TOTAL_BASIS_POINTS;
  const chefFeePercent = basisPointsToPercent(chefFeeBasisPoints);
  const chefFeeAmount = (parseFloat(totalAmount) * chefFeeBasisPoints) / TOTAL_BASIS_POINTS;

  const fees = [
    {
      label: "Protocol fee",
      percentage: protocolFeePercent,
      amount: protocolFeeAmount,
      show: !bypassProtocolFee,
    },
    {
      label: "Referrer fee",
      percentage: referrerFeePercent,
      amount: referrerFeeAmount,
      show: referrerId,
    },
    {
      label: "Chef fee",
      percentage: chefFeePercent,
      amount: chefFeeAmount,
      show: !bypassChefFee && chefFeeBasisPoints,
    },
    {
      label: "On-Chain Storage",
      percentage: "",
      amount: "<0.01",
      show: true,
    },
    {
      label: "Project allocation",
      percentage: projectAllocationPercent,
      amount: projectAllocationAmount,
      show: true,
    },
  ];

  return (
    <BreakdownSummaryContent
      style={props.containerStyle || {}}
      // onClick={() => State.update({ showBreakdown: !state.showBreakdown })}
    >
      <Header style={props.headerStyle || {}}>
        <BreakdownTitle> Breakdown</BreakdownTitle>
      </Header>
      <div className={`breakdown-details ${!state.showBreakdown ? "hidden" : ""}`} active={state.showBreakdown}>
        {fees.map(({ show, amount, label, percentage }) => {
          return show ? (
            <BreakdownItem key={label}>
              <BreakdownItemLeft>
                {label} {percentage ? `(${percentage}%)` : ""}{" "}
              </BreakdownItemLeft>
              <BreakdownItemRight>
                <BreakdownAmount>{typeof amount === "string" ? amount : amount}</BreakdownAmount>
                {ftIcon ? <Icon src={ftIcon} alt="ft-icon" /> : <NearIcon />}
              </BreakdownItemRight>
            </BreakdownItem>
          ) : (
            ""
          );
        })}
      </div>
    </BreakdownSummaryContent>
  );
};

export default BreakdownSummary;
