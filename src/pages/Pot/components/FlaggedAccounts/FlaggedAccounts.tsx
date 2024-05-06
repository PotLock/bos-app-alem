import { useParams, useState } from "alem";
import PotSDK from "@app/SDK/pot";
import ProfileImage from "@app/components/mob.near/ProfileImage";
import { PotDetail } from "@app/types";
import hrefWithParams from "@app/utils/hrefWithParams";
import { Container, Flag, Line, Table, Title } from "./styles";

const FlaggedAccounts = ({ potDetail }: { potDetail: PotDetail }) => {
  const { potId } = useParams();

  const [flaggedAddresses, setFlaggedAddresses] = useState<any>(null);
  const [toggleView, setToggleView] = useState<any>(null);

  if (!flaggedAddresses) {
    PotSDK.getFlaggedAccounts(potDetail, potId)
      .then((data) => {
        const listOfFlagged: any = [];
        data.forEach((adminFlaggedAcc: any) => {
          const addresses = Object.keys(adminFlaggedAcc.potFlaggedAcc);
          addresses.forEach((address) => {
            listOfFlagged.push({
              address: address,
              reason: adminFlaggedAcc.potFlaggedAcc[address],
              flaggedBy: adminFlaggedAcc.flaggedBy,
              role: adminFlaggedAcc.role,
            });
          });
        });

        setFlaggedAddresses(listOfFlagged);
      })
      .catch((err) => console.log("error getting the flagged accounts ", err));
  }

  return !flaggedAddresses ? (
    "Loading..."
  ) : flaggedAddresses.length === 0 ? (
    ""
  ) : (
    <>
      <Container>
        <Title onClick={() => setToggleView(!toggleView)}>
          <div>Flagged Accounts</div>
          <div>{flaggedAddresses?.length}</div>
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            style={{
              rotate: toggleView ? "0deg" : "180deg",
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
        <Table className={`${!toggleView ? "hidden" : ""}`}>
          {flaggedAddresses.map(({ role, flaggedBy, address, reason }: any) => (
            <Flag key={flaggedBy}>
              {/* <div className="vertical-line" /> */}
              <div className="content">
                <div className="header">
                  <ProfileImage className="profile-image" accountId={flaggedBy} />
                  <div className="role">{role}</div>
                  <div className="dot" />
                  <div className="id">
                    <a href={hrefWithParams(`?tab=profile&accountId=${flaggedBy}`)} target="_blank">
                      {flaggedBy}{" "}
                    </a>
                    has flagged
                  </div>
                  <a
                    className="flagged-account"
                    href={hrefWithParams(`?tab=profile&accountId=${address}`)}
                    target="_blank"
                  >
                    {address}
                  </a>
                </div>
                <div className="reason">{reason}</div>
              </div>
            </Flag>
          ))}
        </Table>
      </Container>
      <Line />
    </>
  );
};

export default FlaggedAccounts;
