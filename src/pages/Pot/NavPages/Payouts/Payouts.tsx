import ProfileImage from "@app/components/mob.near/ProfileImage";
import {
  AlertSvg,
  Container,
  Header,
  HeaderItem,
  HeaderItemText,
  InfoContainer,
  MobileAmount,
  Row,
  RowItem,
  RowText,
  SearchBar,
  SearchBarContainer,
  SearchIcon,
  TableContainer,
  WarningText,
} from "./styles";
import PotSDK from "@app/SDK/pot";
import { PotDetail } from "@app/types";
import calculatePayouts from "@app/utils/calculatePayouts";
import { context, useParams, State, state } from "alem";
import yoctosToNear from "@app/utils/yoctosToNear";
import ArrowDown from "@app/assets/svgs/ArrowDown";
import FlaggedAccounts from "../../components/FlaggedAccounts/FlaggedAccounts";
import PayoutsChallenges from "../../components/PayoutsChallenges/PayoutsChallenges";

const Payouts = ({ potDetail, allDonations }: { potDetail: PotDetail; allDonations: any }) => {
  const { potId } = useParams();
  const userIsAdminOrGreater = PotSDK.isUserPotAdminOrGreater(potId, context.accountId); // TODO: ADD THIS BACK IN

  State.init({
    allPayouts: null,
    filteredPayouts: null,
    showChallengePayoutsModal: false,
    flaggedAddresses: null,
  });

  const { allPayouts, filteredPayouts, showChallengePayoutsModal, flaggedAddresses } = state;

  if (!flaggedAddresses) {
    PotSDK.getFlaggedAccounts(potDetail, potId)
      .then((data) => {
        const listOfFlagged: any = [];
        data.forEach((adminFlaggedAcc: any) => {
          const addresses = Object.keys(adminFlaggedAcc.potFlaggedAcc);
          listOfFlagged.push(...addresses);
        });
        State.update({ flaggedAddresses: listOfFlagged });
      })
      .catch((err) => console.log("error getting the flagged accounts ", err));
  }

  if (!allPayouts && allDonations && potDetail && flaggedAddresses) {
    const calculatedPayouts = calculatePayouts(allDonations, potDetail.matching_pool_balance, flaggedAddresses);
    console.log("calculated payouts: ", calculatedPayouts);
    if (potDetail.payouts.length) {
      // handle these payouts, which don't contain all the info needed
      // pot payouts contain id, project_id, amount & paid_at
      // loop through potDetail payouts and synthesize the two sets of payouts, so projectId and matchingAmount are taken from potDetail payouts, and donorCount and totalAmount are taken from calculatedPayouts
      const synthesizedPayouts = potDetail.payouts.map((payout) => {
        const { project_id, amount } = payout;
        const { totalAmount, donorCount } = calculatedPayouts[project_id];
        return {
          projectId: project_id,
          totalAmount,
          matchingAmount: amount,
          donorCount,
        };
      });
      State.update({ allPayouts: synthesizedPayouts, filteredPayouts: synthesizedPayouts });
    } else {
      // calculate estimated payouts
      const allPayouts = Object.entries(calculatedPayouts).map(
        ([projectId, { totalAmount, matchingAmount, donorCount }]: any) => {
          return {
            projectId,
            totalAmount,
            matchingAmount,
            donorCount,
          };
        },
      ); // TODO: refactor to use PotsSDK (note that this is duplicated in Pots/Projects.jsx)
      allPayouts.sort((a, b) => {
        // sort by matching pool allocation, highest to lowest
        return b.matchingAmount - a.matchingAmount;
      });
      State.update({ allPayouts, filteredPayouts: allPayouts });
    }
  }

  const columns = ["Project", "Total Raised", "Total Unique Donors", "Matching Pool Allocation"];

  const { base_currency } = potDetail;

  const searchPayouts = (searchTerm: string) => {
    // filter payouts that match the search term (donor_id, project_id)
    const filteredPayouts = allPayouts.filter((payout: any) => {
      const { projectId } = payout;
      const searchFields = [projectId];
      return searchFields.some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()));
    });
    filteredPayouts.sort((a: any, b: any) => {
      // sort by matching pool allocation, highest to lowest
      return b.matchingAmount - a.matchingAmount;
    });
    return filteredPayouts;
  };

  const MAX_ACCOUNT_ID_DISPLAY_LENGTH = 10;

  return (
    <Container>
      <FlaggedAccounts potDetail={potDetail} />
      <PayoutsChallenges />

      {!potDetail.all_paid_out && (
        <InfoContainer>
          <AlertSvg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.25 4.25H8.75V5.75H7.25V4.25ZM7.25 7.25H8.75V11.75H7.25V7.25ZM8 0.5C3.86 0.5 0.5 3.86 0.5 8C0.5 12.14 3.86 15.5 8 15.5C12.14 15.5 15.5 12.14 15.5 8C15.5 3.86 12.14 0.5 8 0.5ZM8 14C4.6925 14 2 11.3075 2 8C2 4.6925 4.6925 2 8 2C11.3075 2 14 4.6925 14 8C14 11.3075 11.3075 14 8 14Z"
              fill="#EE8949"
            />
          </AlertSvg>

          <WarningText>
            {potDetail.cooldown_end_ms
              ? "These payouts have been set on the contract but have not been paid out yet."
              : "These payouts are estimated amounts only and have not been set on the contract yet."}
          </WarningText>
        </InfoContainer>
      )}
      <TableContainer>
        <Header>
          <HeaderItem className="project">
            <HeaderItemText>Project</HeaderItemText>
          </HeaderItem>
          <HeaderItem>
            <HeaderItemText>Total Raised</HeaderItemText>
          </HeaderItem>
          <HeaderItem>
            <HeaderItemText>Unique Donors</HeaderItemText>
          </HeaderItem>
          <HeaderItem>
            <HeaderItemText>Pool Allocation</HeaderItemText>
          </HeaderItem>
        </Header>
        <SearchBarContainer>
          <SearchIcon>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.7549 14.2549H14.9649L14.6849 13.9849C15.6649 12.8449 16.2549 11.3649 16.2549 9.75488C16.2549 6.16488 13.3449 3.25488 9.75488 3.25488C6.16488 3.25488 3.25488 6.16488 3.25488 9.75488C3.25488 13.3449 6.16488 16.2549 9.75488 16.2549C11.3649 16.2549 12.8449 15.6649 13.9849 14.6849L14.2549 14.9649V15.7549L19.2549 20.7449L20.7449 19.2549L15.7549 14.2549ZM9.75488 14.2549C7.26488 14.2549 5.25488 12.2449 5.25488 9.75488C5.25488 7.26488 7.26488 5.25488 9.75488 5.25488C12.2449 5.25488 14.2549 7.26488 14.2549 9.75488C14.2549 12.2449 12.2449 14.2549 9.75488 14.2549Z"
                fill="#C7C7C7"
              />
            </svg>
          </SearchIcon>
          <SearchBar
            placeholder="Search payouts"
            onChange={({ target: { value } }) => {
              const filteredPayouts = searchPayouts(value);
              State.update({ filteredPayouts });
            }}
          />
        </SearchBarContainer>
        {!filteredPayouts ? (
          <div>Loading</div>
        ) : filteredPayouts.length === 0 ? (
          <Row style={{ padding: "12px" }}>No payouts to display</Row>
        ) : (
          filteredPayouts.map((payout: any, index: number) => {
            const { projectId, donorCount, matchingAmount, totalAmount } = payout;

            return (
              <Row key={index}>
                <RowItem className="project">
                  <ProfileImage
                    style={{
                      height: "24px",
                      width: "24px",
                    }}
                    className="profile-image"
                    accountId={projectId}
                  />
                  <a href={`?tab=project&projectId=${projectId}`} target={"_blank"}>
                    {projectId.length > MAX_ACCOUNT_ID_DISPLAY_LENGTH
                      ? projectId.slice(0, MAX_ACCOUNT_ID_DISPLAY_LENGTH) + "..."
                      : projectId}
                  </a>
                </RowItem>
                {/* Total Raised */}
                <RowItem className="amount">
                  <RowText>{yoctosToNear(totalAmount, true)}</RowText>
                </RowItem>
                <input type="checkbox" className="toggle-check" />
                <MobileAmount>
                  <span>{yoctosToNear(totalAmount, true)}</span> raised from
                  <span>{donorCount}</span> unique donors
                </MobileAmount>
                {/* Total Unique Donors */}
                <RowItem className="donors">
                  <RowText>{donorCount}</RowText>
                </RowItem>
                {/* Matching Pool Allocation */}
                <RowItem>
                  <RowText>
                    {yoctosToNear(matchingAmount, true)} <span>Allocated</span>
                  </RowText>
                </RowItem>
                <ArrowDown />
              </Row>
            );
          })
        )}
      </TableContainer>
    </Container>
  );
};

export default Payouts;
