import { context, useEffect, useParams, useState } from "alem";
import PotSDK from "@app/SDK/pot";
import Arrow from "@app/assets/svgs/Arrow";
import Pagination from "@app/components/Pagination/Pagination";
import ProfileImage from "@app/components/mob.near/ProfileImage";
import _address from "@app/utils/_address";
import calcNetDonationAmount from "@app/utils/calcNetDonationAmount";
import getTimePassed from "@app/utils/getTimePassed";
import getTransactionsFromHashes from "@app/utils/getTransactionsFromHashes";
import hrefWithParams from "@app/utils/hrefWithParams";
import FlagModal from "../FlagModal/FlagModal";
import FlagSuccessModal from "../FlagSuccessModal/FlagSuccessModal";
import FlagBtn from "./FlagBtn";
import { Container, FlagTooltipWrapper, SearchBar, SearchBarContainer, SearchIcon, TrRow } from "./styles";

type FlagSuccess = {
  account: string;
  reason: string;
};

const DonationsTable = (props: any) => {
  const accountId = context.accountId;

  const { filteredDonations, filter, handleSearch, sortDonation, currentFilter, potDetail } = props;
  const { potId, transactionHashes } = useParams();

  const { admins, owner, chef, all_paid_out } = potDetail;

  const nearLogo = "https://ipfs.near.social/ipfs/bafkreicdcpxua47eddhzjplmrs23mdjt63czowfsa2jnw4krkt532pa2ha";

  const [currentPage, setCurrentPage] = useState(1);
  const [flagAddress, setFlagAddress] = useState(null);
  const [successFlag, setSuccessFlag] = useState<FlagSuccess | null>(null);
  const [updateFlaggedAddresses, setUpdateFlaggedAddresses] = useState(false);
  const [flaggedAddresses, setFlaggedAddresses] = useState([]);
  const perPage = 30;

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    PotSDK.getFlaggedAccounts(potDetail, potId)
      .then((data) => setFlaggedAddresses(data))
      .catch((err) => console.log("error getting the flagged accounts ", err));
  }, [successFlag, updateFlaggedAddresses]);

  const potAdmins = [owner, chef, ...admins];
  const hasAuthority = potAdmins.includes(accountId) && !all_paid_out;

  // Handle flag success for extention wallet
  useEffect(() => {
    if (accountId) {
      getTransactionsFromHashes(transactionHashes, accountId).then((trxs) => {
        const transaction = trxs[0].body.result.transaction;

        const methodName = transaction.actions[0].FunctionCall.method_name;
        const signer_id = transaction.signer_id;
        const receiver_id = transaction.receiver_id;

        const { data } = JSON.parse(Buffer.from(transaction.actions[0].FunctionCall.args, "base64").toString("utf-8"));

        if (methodName === "set" && receiver_id === "social.near" && data) {
          try {
            const pLBlacklistedAccounts = JSON.parse(data[signer_id].profile.pLBlacklistedAccounts);
            const pLBlacklistedAccountsForPot = pLBlacklistedAccounts[potId];
            const allPotFlaggedAccounts = Object.keys(pLBlacklistedAccountsForPot);
            const account = allPotFlaggedAccounts[allPotFlaggedAccounts.length - 1];
            const reason = pLBlacklistedAccountsForPot[account];
            setSuccessFlag({
              account,
              reason,
            });
          } catch (err) {
            console.log("error parsing flag transaction ", err);
          }
        }
      });
    }
  }, []);

  const checkIfIsFlagged = (address: string) => flaggedAddresses.find((obj: any) => obj.potFlaggedAcc[address]);

  const FlagTooltip = ({ flag, href, address }: any) => (
    <FlagTooltipWrapper className="flag" onClick={(e) => e.preventDefault()}>
      <div className="tip-icon">
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 5.24537e-07L-2.54292e-07 8L12 8L6 5.24537e-07Z" fill="white" />
        </svg>
      </div>
      <div className="content">
        <ProfileImage style={{}} accountId={flag.flaggedBy} />
        <div className="content-info">
          <div className="title">
            <div className="role">{flag.role}</div>
            <div className="dot" />
            <div className="admin">
              {_address(flag.flaggedBy)} has flagged
              <a href={href} className="flaged" target="_blank" onClick={(e) => e.stopPropagation()}>
                {_address(address)}
              </a>
            </div>
          </div>
          <div className="text">{flag.potFlaggedAcc[address]}</div>
        </div>
      </div>
    </FlagTooltipWrapper>
  );

  const AddressItem = ({ href, address, isFlagged, isProject, className }: any) => (
    <a
      href={href}
      className={className}
      target="_blank"
      onClick={(e) => {
        isFlagged ? e.preventDefault() : null;
      }}
    >
      <ProfileImage style={{}} accountId={address} />
      <div
        style={{
          color: isFlagged ? "#ed464f" : "#292929",
          fontWeight: "600",
        }}
      >
        {_address(address)}
      </div>
      {isFlagged && <FlagTooltip flag={isFlagged} href={href} address={address} />}
      {hasAuthority && (
        <FlagBtn
          isProject={isProject}
          address={address}
          isFlagged={isFlagged}
          setUpdateFlaggedAddresses={setUpdateFlaggedAddresses}
          updateFlaggedAddresse={updateFlaggedAddresses}
          setFlagAddress={setFlagAddress}
        />
      )}
    </a>
  );

  return (
    <Container>
      <div className="transcation">
        <div className="header">
          <div className="address">Donor</div>
          <div className="address">Project</div>
          <div className="sort price" onClick={() => sortDonation("price")}>
            Amount
            {currentFilter === "price" && <Arrow active={filter.price} />}
          </div>
          <div className="sort" onClick={() => sortDonation("date")}>
            Date
            {currentFilter === "date" && <Arrow active={!filter.date} />}
          </div>
        </div>
        <SearchBarContainer>
          <SearchIcon>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.7549 14.2549H14.9649L14.6849 13.9849C15.6649 12.8449 16.2549 11.3649 16.2549 9.75488C16.2549 6.16488 13.3449 3.25488 9.75488 3.25488C6.16488 3.25488 3.25488 6.16488 3.25488 9.75488C3.25488 13.3449 6.16488 16.2549 9.75488 16.2549C11.3649 16.2549 12.8449 15.6649 13.9849 14.6849L14.2549 14.9649V15.7549L19.2549 20.7449L20.7449 19.2549L15.7549 14.2549ZM9.75488 14.2549C7.26488 14.2549 5.25488 12.2449 5.25488 9.75488C5.25488 7.26488 7.26488 5.25488 9.75488 5.25488C12.2449 5.25488 14.2549 7.26488 14.2549 9.75488C14.2549 12.2449 12.2449 14.2549 9.75488 14.2549Z"
                fill="#C7C7C7"
              />
            </svg>
          </SearchIcon>
          <SearchBar placeholder="Search donations" onChange={handleSearch} />
        </SearchBarContainer>
        {filteredDonations.length > 0 ? (
          filteredDonations.slice((currentPage - 1) * perPage, currentPage * perPage).map((donation: any) => {
            const { donor_id, recipient_id, donated_at_ms, donated_at, project_id } = donation;
            const projectId = recipient_id || project_id;

            const isDonorFlagged = checkIfIsFlagged(donor_id);
            const isProjectFlagged = checkIfIsFlagged(projectId);

            const projectHref = hrefWithParams(`?tab=project&projectId=${projectId}`);
            const profileHref = hrefWithParams(`?tab=profile&accountId=${donor_id}`);
            return (
              <TrRow key={donated_at_ms || donated_at_ms}>
                {/* Donor */}
                <AddressItem
                  address={donor_id}
                  isFlagged={isDonorFlagged}
                  href={profileHref}
                  isProject={false}
                  className="address"
                />

                {/* Project */}

                <AddressItem
                  address={projectId}
                  isFlagged={isProjectFlagged}
                  href={projectHref}
                  isProject={true}
                  className="address project"
                />

                <div className="price">
                  <span>Donated</span>
                  <img src={nearLogo} alt="NEAR" />
                  {calcNetDonationAmount(donation).toFixed(2)}
                </div>

                <div className="date">
                  {getTimePassed(donated_at_ms || donated_at)} ago <span> to </span>
                  <AddressItem
                    address={projectId}
                    isFlagged={isProjectFlagged}
                    href={projectHref}
                    isProject={true}
                    className="project-mobile-view"
                  />
                </div>
              </TrRow>
            );
          })
        ) : (
          <TrRow>No donations</TrRow>
        )}
      </div>
      <Pagination
        {...{
          onPageChange: (page) => {
            setCurrentPage(page);
          },
          data: filteredDonations,
          currentPage,
          perPage: perPage,
        }}
      />
      {flagAddress && (
        <FlagModal
          {...{
            flagAddress: flagAddress,
            setSuccessFlag,
            onClose: () => setFlagAddress(null),
          }}
        />
      )}
      {accountId && successFlag && (
        <FlagSuccessModal
          {...{
            successFlag: successFlag,

            onClose: () => setSuccessFlag(null),
          }}
        />
      )}
    </Container>
  );
};

export default DonationsTable;
