import { useState, context, useParams, useEffect, Markdown, Near } from "alem";
import PotSDK from "@app/SDK/pot";
import Button from "@app/components/Button";
import constants from "@app/constants";
import { useDonationModal } from "@app/hooks/useDonationModal";
import useModals from "@app/hooks/useModals";
import nearToUsd from "@app/modules/nearToUsd";
import CopyIcon from "@app/pages/Project/components/CopyIcon";
import { getConfig, getDonations, getFlaggedAccounts, getPotProjects } from "@app/services/getPotData";
import { PotDetail, PotDonation } from "@app/types";
import calculatePayouts from "@app/utils/calculatePayouts";
import getTransactionsFromHashes from "@app/utils/getTransactionsFromHashes";
import yoctosToNear from "@app/utils/yoctosToNear";
import yoctosToUsdWithFallback from "@app/utils/yoctosToUsdWithFallback";
import ChallengeModal from "../ChallengeModal/ChallengeModal";
import FundModal from "../FundModal/FundModal";
import NewApplicationModal from "../NewApplicationModal/NewApplicationModal";
import PayoutsModal from "../PayoutsModal/PayoutsModal";
import PoolAllocationTable from "../PoolAllocationTable/PoolAllocationTable";
import SuccessFundModal, { ExtendedFundDonation } from "../SuccessFundModal/SuccessFundModal";
import { ButtonsWrapper, Container, Description, Fund, HeaderWrapper, Referral, Title } from "./styles";

const Header = () => {
  const { IPFS_BASE_URL, NADA_BOT_URL } = constants;

  const { potId, transactionHashes } = useParams();

  // Start Modals provider
  const Modals = useModals();
  // Use specific modal context
  const { setDonationModalProps } = useDonationModal();

  const NADABOT_ICON_URL = IPFS_BASE_URL + "bafkreiecgkoybmplo4o542fphclxrhh4nlof5uit3lkzyv4eo2qymrpsru";
  const accountId = context.accountId || "";

  const [isMatchingPoolModalOpen, setIsMatchingPoolModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [showChallengePayoutsModal, setShowChallengePayoutsModal] = useState(false);
  const [projects, setProjects] = useState<any>(null);
  const [registryStatus, setRegistryStatus] = useState<any>(null);
  const [isDao, setIsDao] = useState(null);
  const [applicationSuccess, setApplicationSuccess] = useState(null);
  const [flaggedAddresses, setFlaggedAddresses] = useState(null);
  const [potDetail, setPotDetail] = useState<null | PotDetail>(null);
  const [allDonations, setAlldonations] = useState<null | PotDonation[]>(null);
  const [payoutsToProcess, setPayoutsToProcess] = useState<any>(null);

  // set fund mathcing pool success
  const [fundDonation, setFundDonation] = useState<null | ExtendedFundDonation>(null);

  useEffect(() => {
    if (!potDetail)
      getConfig({
        potId,
        updateState: setPotDetail,
      });
    if (!projects)
      getPotProjects({
        potId,
        isApprpved: true,
        updateState: setProjects,
      });
    if (potDetail && !flaggedAddresses) {
      getFlaggedAccounts({
        potId,
        potDetail,
        type: "list",
        updateState: setFlaggedAddresses,
      });
    }
    if (!allDonations && potDetail)
      getDonations({
        potId,
        potDetail,
        updateState: setAlldonations,
      });
  }, [potDetail]);

  if (potDetail === null) return <div className="spinner-border text-secondary" role="status" />;

  // Handle fund success for web wallet

  const {
    admins,
    chef,
    owner,
    pot_name,
    pot_description,
    matching_pool_balance,
    public_round_end_ms,
    public_round_start_ms,
    application_start_ms,
    application_end_ms,
    cooldown_end_ms: _cooldown_end_ms,
    all_paid_out,
    registry_provider,
  } = potDetail;

  useEffect(() => {
    if (accountId && transactionHashes) {
      getTransactionsFromHashes(transactionHashes, accountId).then((trxs) => {
        const transaction = trxs[0].body.result.transaction;

        const methodName = transaction.actions[0].FunctionCall.method_name;
        const receiver_id = transaction.receiver_id;
        const successVal = trxs[0].body.result.status?.SuccessValue;
        const result = JSON.parse(Buffer.from(successVal, "base64").toString("utf-8")); // atob not working

        if (methodName === "donate" && receiver_id === potId && result.matching_pool) {
          setFundDonation({
            ...result,
            potId,
            potDetail,
          });
        }
      });
    }
  }, []);

  const verifyIsOnRegistry = (address: any) => {
    Near.asyncView("lists.potlock.near", "get_registrations_for_registrant", {
      registrant_id: address,
    }).then((registrations) => {
      const registration = registrations.find(
        (registration: any) => registration.list_id === 1, // potlock registry list id
      );
      if (registration) {
        setRegistryStatus(registration.status);
      }
    });
  };

  useEffect(() => {
    if (!isDao) {
      verifyIsOnRegistry(context.accountId || "");
    }
  }, []);

  const projectNotRegistered = registryStatus === null;
  const userIsAdminOrGreater = admins.includes(accountId) || owner === accountId;
  const userIsChefOrGreater = userIsAdminOrGreater || chef === accountId;

  const existingApplication = PotSDK.getApplicationByProjectId(potId, context.accountId);

  const applicationExists = existingApplication || applicationSuccess;

  const now = Date.now();

  const cooldown_end_ms = _cooldown_end_ms ?? now + 1000;

  const publicRoundOpen = now >= public_round_start_ms && now < public_round_end_ms;

  const applicationOpen = now >= application_start_ms && now < application_end_ms;

  const canApply = applicationOpen && !applicationExists && !userIsChefOrGreater;

  const potLink = `https://bos.potlock.io/?tab=pot&potId=${potId}${
    context.accountId && `&referrerId=${context.accountId}`
  }`;

  const canPayoutsBeProcessed = userIsAdminOrGreater && now >= cooldown_end_ms && !all_paid_out;

  const canPayoutsBeSet = userIsChefOrGreater && !all_paid_out && (now > cooldown_end_ms || !_cooldown_end_ms);

  const payoutsChallenges = PotSDK.getPayoutsChallenges(potId);

  const handleSetPayouts = () => {
    if (allDonations && flaggedAddresses !== null) {
      calculatePayouts(allDonations, matching_pool_balance, flaggedAddresses).then((calculatedPayouts: any) => {
        setPayoutsToProcess(calculatedPayouts);
      });
    } else {
      console.log("error fetching donations or flagged addresses");
    }
  };

  const handleProcessPayouts = () => {
    PotSDK.adminProcessPayouts(potId);
    // NB: we won't get here if user used a web wallet, as it will redirect to the wallet
    // <---- EXTENSION WALLET HANDLING ----> // TODO: implement
  };

  const existingChallengeForUser: any = (payoutsChallenges || []).find(
    (challenge: any) => challenge.challenger_id === context.accountId,
  );

  const canDonate = projects.length > 0 && publicRoundOpen && context.accountId;

  const registrationApproved = registryStatus === "Approved";

  const registrationApprovedOrNoRegistryProvider = registrationApproved || !registry_provider;

  return (
    <Container>
      <Modals />
      <HeaderWrapper>
        <Title>{pot_name}</Title>
        <Description>
          <Markdown text={pot_description} />
        </Description>
        <Fund>
          <div className="label">Matching Funds Available:</div>
          <div>
            <div className="near-price">{yoctosToNear(matching_pool_balance, true)}</div>
            {nearToUsd && <div className="usd-price"> {yoctosToUsdWithFallback(matching_pool_balance, true)}</div>}
          </div>
        </Fund>
        <ButtonsWrapper>
          {canDonate && (
            <Button
              href={canDonate ? "" : NADA_BOT_URL}
              onClick={
                canDonate
                  ? () => {
                      setDonationModalProps({ potId, potDetail, projects, multiple: true });
                    }
                  : () => {}
              }
              target={canDonate ? "_self" : "_blank"}
              iconSrc={canDonate ? "" : NADABOT_ICON_URL}
            >
              Donate
            </Button>
          )}
          {now < public_round_end_ms && (
            <Button onClick={() => setIsMatchingPoolModalOpen(true)} varient="tonal">
              Fund matching pool
            </Button>
          )}
          {canApply && (
            <Button
              varient={registrationApprovedOrNoRegistryProvider || projectNotRegistered ? "filled" : "outline"}
              style={{ marginRight: "24px" }}
              isDisabled={!registrationApprovedOrNoRegistryProvider}
              onClick={() => setIsApplicationModalOpen(true)}
            >
              {registrationApprovedOrNoRegistryProvider ? "Apply to pot" : `Project Registration ${registryStatus}`}
            </Button>
          )}
          {now > public_round_end_ms && now < cooldown_end_ms && !!_cooldown_end_ms && (
            <Button varient="tonal" onClick={() => setShowChallengePayoutsModal(true)}>
              {existingChallengeForUser ? "Update challenge" : "Challenge payouts"}
            </Button>
          )}
          {canPayoutsBeSet && <Button onClick={handleSetPayouts}> Set Payouts </Button>}
          {canPayoutsBeProcessed && <Button onClick={handleProcessPayouts}>Process Payouts</Button>}
        </ButtonsWrapper>
        <Referral>
          <CopyIcon textToCopy={potLink} />
          Earn referral fees
        </Referral>
      </HeaderWrapper>
      <div className="pool-table">
        <PoolAllocationTable />
      </div>
      {isApplicationModalOpen && (
        <NewApplicationModal
          onClose={() => setIsApplicationModalOpen(false)}
          setIsDao={setIsDao}
          isDao={isDao}
          registryStatus={registryStatus}
          setRegistryStatus={setRegistryStatus}
          setApplicationSuccess={setApplicationSuccess}
          potDetail={potDetail}
        />
      )}
      {showChallengePayoutsModal && (
        <ChallengeModal
          existingChallengeForUser={existingChallengeForUser}
          onClose={() => setShowChallengePayoutsModal(false)}
        />
      )}
      {/* Fund Matching Pool Modal */}
      {isMatchingPoolModalOpen && (
        <FundModal
          setFundDonation={setFundDonation}
          potDetail={potDetail}
          onClose={() => {
            setIsMatchingPoolModalOpen(false);
          }}
        />
      )}
      {/* Fund Matching Pool Success Modal */}
      {fundDonation && (
        <SuccessFundModal
          fundDonation={fundDonation}
          onClose={() => {
            setFundDonation(null);
          }}
        />
      )}
      {/* Admin process Payout */}
      {payoutsToProcess && (
        <PayoutsModal setPayoutsToProcess={setPayoutsToProcess} potId={potId} originalPayouts={payoutsToProcess} />
      )}
    </Container>
  );
};

export default Header;
