import { State, context, state, useParams } from "alem";
import PotSDK from "@app/SDK/pot";
import AdminIcon from "@app/assets/svgs/AdminIcon";
import ProfileImage from "@app/components/mob.near/ProfileImage";
import getTimePassed from "@app/utils/getTimePassed";
import hrefWithParams from "@app/utils/hrefWithParams";
import ChallangeResolveModal from "../ChallangeResolveModal/ChallangeResolveModal";
import { Challenge, Container, Table, Title, Line } from "./styles";

const PayoutsChallenges = () => {
  const { potId } = useParams();
  const payoutsChallenges = PotSDK.getPayoutsChallenges(potId); // TODO: ADD THIS BACK IN

  const userIsAdminOrGreater = PotSDK.isUserPotAdminOrGreater(potId, context.accountId); // TODO: ADD THIS BACK IN

  State.init({
    adminModalChallengerId: "",
    toggleChallenges: false,
  });

  const { adminModalChallengerId, toggleChallenges } = state;

  return !payoutsChallenges ? (
    "Loading..."
  ) : payoutsChallenges.length === 0 ? (
    ""
  ) : (
    <>
      <Container>
        <Title
          onClick={() =>
            State.update({
              toggleChallenges: !toggleChallenges,
            })
          }
        >
          <div>Payout Challenges</div>
          <div>{payoutsChallenges?.length}</div>
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            style={{
              rotate: toggleChallenges ? "0deg" : "180deg",
            }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 0.294922L0 6.29492L1.41 7.70492L6 3.12492L10.59 7.70492L12 6.29492L6 0.294922Z"
              fill="#151A23"
            />
          </svg>
        </Title>
        <Table className={`${!toggleChallenges ? "hidden" : ""}`}>
          {payoutsChallenges.map(({ challenger_id, admin_notes, created_at, reason, resolved }: any) => (
            <Challenge key={challenger_id}>
              {/* <div className="vertical-line" /> */}
              <div className="content">
                <div className="header">
                  <ProfileImage className="profile-image" accountId={challenger_id} />
                  <a className="id" href={hrefWithParams(`?tab=profile&accountId=${challenger_id}`)}>
                    {challenger_id}
                  </a>
                  <div className="title">Challenged payout</div>
                  <div className="date"> {getTimePassed(created_at)}</div>
                </div>
                <div className="reason">{reason}</div>
                <div className="admin-header">
                  <div className="admin-icon">
                    <AdminIcon />
                  </div>
                  <div
                    className="resolved-state"
                    style={{
                      color: resolved ? "#4a7714" : "#C7C7C7",
                    }}
                  >
                    {resolved ? "Resolved" : "Unresolved"}
                  </div>

                  {resolved ? (
                    <>
                      <div className="dot" />
                      <div>1 Response</div>
                    </>
                  ) : userIsAdminOrGreater ? (
                    <>
                      <div className="dot" />
                      <button
                        className="resolve-btn"
                        onClick={() => State.update({ adminModalChallengerId: challenger_id })}
                      >
                        Reply
                      </button>
                    </>
                  ) : (
                    ""
                  )}
                </div>

                <div className="reason">{admin_notes}</div>
              </div>
            </Challenge>
          ))}
        </Table>
        {/* Admin update challenge modal */}
        {adminModalChallengerId && (
          <ChallangeResolveModal
            adminModalChallengerId={adminModalChallengerId}
            onClose={() =>
              State.update({
                adminModalChallengerId: "",
              })
            }
          />
        )}
      </Container>
      <Line />
    </>
  );
};

export default PayoutsChallenges;
