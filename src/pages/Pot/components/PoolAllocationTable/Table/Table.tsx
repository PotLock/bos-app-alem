import { Social, useState } from "alem";
import Image from "@app/components/mob.near/Image";
import constants from "@app/constants";
import nearToUsd from "@app/modules/nearToUsd";
import _address from "@app/utils/_address";
import formatWithCommas from "@app/utils/formatWithCommas";
import hrefWithParams from "@app/utils/hrefWithParams";
import yoctosToUsdWithFallback from "@app/utils/yoctosToUsdWithFallback";
import { Container, Row } from "./styles";

const Table = ({ donations, totalAmount, totalUniqueDonors, title, allPayouts, potDetail }: any) => {
  const [usdToggle, setUsdToggle] = useState<any>(false);
  const { SUPPORTED_FTS } = constants;

  return (
    <Container>
      <div className="header">
        {totalAmount}
        <span>raised from</span>
        {totalUniqueDonors}
        <span>{title === "sponsors" ? "sponsors" : "donors"}</span>
      </div>
      <div className="sort">
        <div className="title">Top {title} </div>
        <div
          className="sort-btn"
          style={{
            cursor: nearToUsd ? "pointer" : "default",
          }}
          onClick={() => (nearToUsd ? setUsdToggle(!usdToggle) : "")}
        >
          {nearToUsd && (
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 10.7575V5.5H7.5V10.7575H5.25L8.25 13.75L11.25 10.7575H9ZM3.75 0.25L0.75 3.2425H3V8.5H4.5V3.2425H6.75L3.75 0.25ZM9 10.7575V5.5H7.5V10.7575H5.25L8.25 13.75L11.25 10.7575H9ZM3.75 0.25L0.75 3.2425H3V8.5H4.5V3.2425H6.75L3.75 0.25Z"
                fill="#7B7B7B"
              />
            </svg>
          )}
          {usdToggle ? "USD" : "NEAR"}
        </div>
      </div>
      {donations.map(({ projectId, donor_id, matchingAmount, net_amount }: any, idx: number) => {
        const id = donor_id || projectId;
        const nearAmount = formatWithCommas(
          SUPPORTED_FTS[potDetail.base_currency.toUpperCase()].fromIndivisible(net_amount || matchingAmount),
        );

        const profile = Social.getr(`${id}/profile`);
        const matchedAmout = usdToggle ? yoctosToUsdWithFallback(matchingAmount || net_amount, true) : nearAmount;

        const url = projectId ? `?tab=project&projectId=${projectId}` : `?tab=profile&accountId=${donor_id}`;
        return (
          <Row>
            <div>#{idx + 1}</div>
            <a className="address" href={hrefWithParams(url)}>
              <Image
                image={profile?.image}
                className="profile-image"
                fallbackUrl="https://ipfs.near.social/ipfs/bafkreiccpup6f2kihv7bhlkfi4omttbjpawnsns667gti7jbhqvdnj4vsm"
                style={{}}
              />
              {_address(profile?.name || id, 15)}
            </a>
            <div>
              {matchedAmout} {usdToggle ? " " : "N"}
            </div>
          </Row>
        );
      })}
    </Container>
  );
};

export default Table;
