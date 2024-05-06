import { useState, context, useParams, useEffect, Markdown, Near } from "alem";
import PotSDK from "@app/SDK/pot";
import Button from "@app/components/Button";
import constants from "@app/constants";
import { useDonationModal } from "@app/hooks/useDonationModal";
import CopyIcon from "@app/pages/Project/components/CopyIcon";
import { PotDetail } from "@app/types";
import calculatePayouts from "@app/utils/calculatePayouts";
import nearToUsd from "@app/utils/nearToUsd";
import yoctosToNear from "@app/utils/yoctosToNear";
import yoctosToUsdWithFallback from "@app/utils/yoctosToUsdWithFallback";
import ChallengeModal from "../ChallengeModal/ChallengeModal";
import FundModal from "../FundModal/FundModal";
import NewApplicationModal from "../NewApplicationModal/NewApplicationModal";
import PoolAllocationTable from "../PoolAllocationTable/PoolAllocationTable";
import { ButtonsWrapper, Container, Description, Fund, HeaderWrapper, Referral, Title } from "./styles";

const Header = ({ potDetail, allDonations }: { potDetail: PotDetail; allDonations: any }) => {
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
    cooldown_end_ms,
    all_paid_out,
  } = potDetail;

  const { IPFS_BASE_URL, NADA_BOT_URL } = constants;

  const { potId } = useParams();

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

  useEffect(() => {
    if (!projects) {
      PotSDK.asyncGetApprovedApplications(potId).then((projects: any) => {
        setProjects(projects);
      });
    }
  }, []);

  const applicationExists = existingApplication || applicationSuccess;

  const now = Date.now();
  const publicRoundOpen = now >= public_round_start_ms && now < public_round_end_ms;
  const publicRoundEnded = now > public_round_end_ms;

  const applicationOpen = now >= application_start_ms && now < application_end_ms;

  const canApply = applicationOpen && !applicationExists && !userIsChefOrGreater;

  const potLink = `https://bos.potlock.io/?tab=pot&potId=${potId}${
    context.accountId && `&referrerId=${context.accountId}`
  }`;

  const canPayoutsBeProcessed = userIsAdminOrGreater && now >= cooldown_end_ms && !all_paid_out;

  const canPayoutsBeSet = userIsChefOrGreater && !all_paid_out && publicRoundEnded;

  const payoutsChallenges = PotSDK.getPayoutsChallenges(potId);

  if (!flaggedAddresses) {
    PotSDK.getFlaggedAccounts(potDetail, potId)
      .then((data) => {
        const listOfFlagged: any = [];
        data.forEach((adminFlaggedAcc: any) => {
          const addresses = Object.keys(adminFlaggedAcc.potFlaggedAcc);
          listOfFlagged.push(...addresses);
        });
        setFlaggedAddresses(listOfFlagged);
      })
      .catch((err) => console.log("error getting the flagged accounts ", err));
  }

  const handleSetPayouts = () => {
    if (allDonations && flaggedAddresses !== null) {
      calculatePayouts(allDonations, matching_pool_balance, flaggedAddresses).then((calculatedPayouts: any) => {
        const payouts = Object.entries(calculatedPayouts)
          .map(([projectId, { matchingAmount }]: any) => ({
            project_id: projectId,
            amount: matchingAmount,
          }))
          .filter((payout) => payout.amount !== "0");
        PotSDK.chefSetPayouts(potId, payouts);
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

  return (
    <Container>
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
              varient={registrationApproved || projectNotRegistered ? "filled" : "outline"}
              style={{ marginRight: "24px" }}
              isDisabled={registryStatus && !registrationApproved}
              onClick={() => setIsApplicationModalOpen(true)}
            >
              {registryStatus && !registrationApproved ? `Project Registration ${registryStatus}` : "Apply to pot"}
            </Button>
          )}
          {now > public_round_end_ms && now < cooldown_end_ms && (
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
        <PoolAllocationTable allDonations={allDonations} potDetail={potDetail} />
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
      {isMatchingPoolModalOpen && (
        <FundModal
          potDetail={potDetail}
          onClose={() => {
            setIsMatchingPoolModalOpen(false);
          }}
        />
      )}
      {showChallengePayoutsModal && (
        <ChallengeModal
          existingChallengeForUser={existingChallengeForUser}
          onClose={() => setShowChallengePayoutsModal(false)}
        />
      )}
    </Container>
  );
};

export default Header;
