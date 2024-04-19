import { Big, Near, props } from "alem";
import PotSDK from "@app/SDK/pot";
import DonateSDK from "@app/SDK/donate";
import constants from "@app/constants";
import { Amout, ButtonWrapper, Container, FeesRemoval, Label, NoteWrapper } from "./styles";
import nearToUsd from "@app/utils/nearToUsd";
import ProfileImage from "@app/components/mob.near/ProfileImage";
import CheckBox from "@app/components/Inputs/Checkbox/Checkbox";
import Button from "@app/components/Button";
import NearIcon from "@app/assets/svgs/near-icon";
import BreakdownSummary from "@app/components/Cart/BreakdownSummary/BreakdownSummary";
import TextArea from "@app/components/Inputs/TextArea/TextArea";

const ConfirmDirect = ({
  selectedDenomination,
  bypassProtocolFee,
  bypassChefFee,
  donationNote,
  donationNoteError,
  addNote,
  updateState,
  selectedRound,
  projectId,
  referrerId,
  accountId,
  amount,
  openDonationSuccessModal,
  donationType,
}: any) => {
  const getFeesBasisPoints = (protocolConfig: any, potDetail: any, donationContractConfig: any) => {
    if (protocolConfig) {
      return [protocolConfig.account_id, protocolConfig.basis_points, potDetail.referral_fee_public_round_basis_points];
    } else if (donationContractConfig) {
      return [
        donationContractConfig.protocol_fee_recipient_account,
        donationContractConfig.protocol_fee_basis_points,
        donationContractConfig.referral_fee_basis_points,
      ];
    } else {
      return ["", 0, 0];
    }
  };

  const pollForDonationSuccess = ({
    projectId: donatedProject,
    afterTs,
    accountId,
    openDonationSuccessModal,
    isPotDonation,
  }: any) => {
    // poll for updates
    // TODO: update this to also poll Pot contract
    const pollIntervalMs = 1000;
    // const totalPollTimeMs = 60000; // consider adding in to make sure interval doesn't run indefinitely
    const pollId = setInterval(() => {
      (isPotDonation ? PotSDK : DonateSDK).asyncGetDonationsForDonor(accountId).then((donations: any) => {
        for (const donation of donations) {
          const { recipient_id, project_id, donated_at_ms, donated_at } = donation; // donation contract uses recipient_id, pot contract uses project_id; donation contract uses donated_at_ms, pot contract uses donated_at

          if (
            ((project_id || recipient_id) === donatedProject && (donated_at_ms || donated_at) > afterTs) ||
            donated_at > afterTs
          ) {
            // display success message
            clearInterval(pollId);

            openDonationSuccessModal({
              projectId: donation,
            });
          }
        }
      });
    }, pollIntervalMs);
  };

  const ProfileImg = ({ accountId }: any) => <ProfileImage accountId={accountId} style={{}} />;

  const CheckBoxWrapper = ({ id, checked, onClick }: any) => (
    <CheckBox
      {...{
        id,
        checked,
        onClick,
      }}
    />
  );

  // Get protcol, referral & chef Fee
  const potDetail = PotSDK.getConfig(selectedRound);

  const protocolConfigContractId = potDetail ? potDetail.protocol_config_provider.split(":")[0] : "";
  const protocolConfigViewMethodName = potDetail ? potDetail.protocol_config_provider.split(":")[1] : "";
  const protocolConfig =
    protocolConfigContractId && protocolConfigViewMethodName
      ? Near.view(protocolConfigContractId, protocolConfigViewMethodName, {})
      : null;

  const donationContractConfig = !potDetail ? DonateSDK.getConfig() || {} : null;

  const [protocolFeeRecipientAccount, protocolFeeBasisPoints, referralFeeBasisPoints] = getFeesBasisPoints(
    protocolConfig,
    potDetail,
    donationContractConfig,
  );

  const chefFeeBasisPoints = donationType === "pot" ? potDetail?.chef_fee_basis_points : "";

  const storageBalanceBounds = Near.view<any>(selectedDenomination.id, "storage_balance_bounds", {});
  const storageBalanceProtocolFeeRecipient = Near.view<any>(selectedDenomination.id, "storage_balance_of", {
    account_id: protocolFeeRecipientAccount,
  });
  const storageBalanceReferrer = referrerId
    ? Near.view<any>(selectedDenomination.id, "storage_balance_of", {
        account_id: referrerId,
      })
    : null;
  const storageBalanceDonationContract = Near.view<any>(selectedDenomination.id, "storage_balance_of", {
    account_id: constants.DONATION_CONTRACT_ID,
  });

  const handleDonate = () => {
    const donationAmountIndivisible = Big(amount).mul(new Big(10).pow(selectedDenomination.decimals));

    const args: any = {
      referrer_id: referrerId,
      bypass_protocol_fee: bypassProtocolFee,
      message: donationNote,
      ...(bypassChefFee ? { custom_chef_fee_basis_points: 0 } : {}),
    };

    const potId = selectedRound || null;
    const isPotDonation = potId && donationType === "pot";

    const now = Date.now();

    const successArgs = {
      projectId,
      afterTs: now,
      accountId,
      openDonationSuccessModal,
      isPotDonation,
    };

    if (isPotDonation) {
      args.project_id = projectId;
      if (bypassChefFee) {
        args.custom_chef_fee_basis_points = 0;
      }
    } else {
      args.recipient_id = projectId;
    }
    // FT WORKFLOW:
    // 1. SEND DEPOSIT TO DONATION CONTRACT
    /// 2. CALL FT CONTRACT:
    /// - check for storage balance for all accounts (protocol fee recipient, referrer, project, donation contract)
    const transactions: any[] = [];

    const isFtDonation = selectedDenomination.text !== "NEAR";

    if (isFtDonation) {
      const ftId = selectedDenomination.id;
      // add storage deposit transaction
      let requiredDepositFloat = 0.012; // base amount for donation storage
      requiredDepositFloat += 0.0001 * args.message.length; // add 0.0001 NEAR per character in message
      transactions.push({
        contractName: constants.DONATION_CONTRACT_ID,
        methodName: "storage_deposit",
        args: {},
        deposit: Big(requiredDepositFloat).mul(Big(10).pow(24)),
        gas: "100000000000000",
      });
      const { min, max } = storageBalanceBounds;
      const storageMaxBig = Big(max);

      // check storage balance for each account
      if (
        !args.bypass_protocol_fee &&
        (!storageBalanceProtocolFeeRecipient || Big(storageBalanceProtocolFeeRecipient.total).lt(storageMaxBig))
      ) {
        transactions.push({
          contractName: ftId,
          methodName: "storage_deposit",
          args: { account_id: protocolFeeRecipientAccount },
          deposit: storageMaxBig.minus(Big(storageBalanceProtocolFeeRecipient || 0)),
          gas: "100000000000000",
        });
      }
      // referrer
      if (referrerId && (!storageBalanceReferrer || Big(storageBalanceReferrer.total).lt(storageMaxBig))) {
        transactions.push({
          contractName: ftId,
          methodName: "storage_deposit",
          args: { account_id: referrerId },
          deposit: storageMaxBig.minus(Big(storageBalanceReferrer || 0)),
          gas: "100000000000000",
        });
      }
      // donation contract
      if (!storageBalanceDonationContract || Big(storageBalanceDonationContract.total).lt(storageMaxBig)) {
        transactions.push({
          contractName: ftId,
          methodName: "storage_deposit",
          args: { account_id: constants.DONATION_CONTRACT_ID },
          deposit: storageMaxBig.minus(Big(storageBalanceDonationContract || 0)),
          gas: "100000000000000",
        });
      }
      // project (can't do this till this point)
      Near.asyncView(ftId, "storage_balance_of", { account_id: projectId }).then((balance) => {
        if (!balance || Big(balance.total).lt(storageMaxBig)) {
          transactions.push({
            contractName: ftId,
            methodName: "storage_deposit",
            args: { account_id: projectId },
            deposit: storageMaxBig.minus(Big(balance || 0)),
            gas: "100000000000000",
          });
        }

        // add donation transaction
        transactions.push({
          contractName: ftId,
          methodName: "ft_transfer_call",
          args: {
            receiver_id: constants.DONATION_CONTRACT_ID,
            amount: donationAmountIndivisible.toFixed(0),
            msg: JSON.stringify({
              recipient_id: projectId,
              referrer_id: referrerId || null,
              bypass_protocol_fee: bypassProtocolFee,
              message: args.message,
            }),
          },
          deposit: "1",
          gas: "300000000000000",
        });
        Near.call(transactions);
        // NB: we won't get here if user used a web wallet, as it will redirect to the wallet
        // <-------- EXTENSION WALLET HANDLING -------->
        pollForDonationSuccess(successArgs);
      });
    } else {
      transactions.push({
        contractName: isPotDonation ? potId : constants.DONATION_CONTRACT_ID,
        methodName: "donate",
        args,
        deposit: donationAmountIndivisible.toFixed(0),
        gas: "300000000000000",
      });
      Near.call(transactions);
      // NB: we won't get here if user used a web wallet, as it will redirect to the wallet
      // <-------- EXTENSION WALLET HANDLING -------->
      pollForDonationSuccess(successArgs);
    }
  };

  const MAX_NOTE_LENGTH = 60;

  return (
    <Container>
      <div>
        <Label>Total amount</Label>
        <Amout>
          <div>{selectedDenomination.icon ? <img src={selectedDenomination.icon} /> : <NearIcon />}</div>
          <div>
            {amount} <span>{selectedDenomination.text}</span>
          </div>
          {nearToUsd && <div className="usd-amount">~${(nearToUsd * amount).toFixed(2)}</div>}
        </Amout>
      </div>
      <div>
        <BreakdownSummary
          {...{
            ...props,
            referrerId,
            protocolFeeBasisPoints,
            referralFeeBasisPoints,
            bypassChefFee,
            chef: potDetail?.chef,
            chefFeeBasisPoints,
            totalAmount: amount,
            bypassProtocolFee: bypassProtocolFee,
            ftIcon: selectedDenomination.icon,
          }}
        />
      </div>
      <FeesRemoval>
        <div className="check">
          <CheckBoxWrapper
            id="bypassProtocolFeeSelector"
            checked={bypassProtocolFee}
            onClick={(e: any) => {
              updateState({ bypassProtocolFee: e.target.checked });
            }}
          />

          <div className="label">Remove {protocolFeeBasisPoints / 100 || "-"}% protocol fee</div>
          <a
            href={`https://near.social/mob.near/widget/ProfilePage?accountId=${protocolFeeRecipientAccount}`}
            className="address"
            target="_blank"
          >
            <ProfileImg accountId={protocolFeeRecipientAccount} />

            {protocolFeeRecipientAccount}
          </a>
        </div>
        {potDetail?.chef && chefFeeBasisPoints > 0 && (
          <div className="check">
            <CheckBoxWrapper
              id="bypassChefFeeSelector"
              checked={bypassChefFee}
              onClick={(e: any) => {
                updateState({ bypassChefFee: e.target.checked });
              }}
            />

            <div className="label"> Remove {chefFeeBasisPoints / 100 || "-"}% chef fee</div>
            <a
              href={`https://near.social/mob.near/widget/ProfilePage?accountId=${potDetail?.chef}`}
              className="address"
              target="_blank"
            >
              <ProfileImg accountId={potDetail?.chef} />

              {potDetail?.chef}
            </a>
          </div>
        )}
      </FeesRemoval>

      {addNote ? (
        <TextArea
          {...{
            label: "Note",
            inputRows: 2,
            inputStyle: {
              background: "#FAFAFA",
            },
            placeholder: `Add an optional note for the project (max ${MAX_NOTE_LENGTH} characters)`,
            value: donationNote,
            onChange: (donationNote: any) => updateState({ donationNote }),
            validate: () => {
              if (donationNote.length > MAX_NOTE_LENGTH) {
                updateState({
                  donationNoteError: `Note must be less than ${MAX_NOTE_LENGTH} characters`,
                });
                return;
              }
              updateState({ donationNoteError: "" });
            },
            error: donationNoteError,
          }}
        />
      ) : (
        <NoteWrapper onClick={() => updateState({ addNote: true })}>
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0.249054 13.7509H3.06155L11.3566 5.4559L8.54405 2.6434L0.249054 10.9384V13.7509ZM1.74905 11.5609L8.54405 4.7659L9.23405 5.4559L2.43905 12.2509H1.74905V11.5609Z"
              fill="#7B7B7B"
            />
            <path
              d="M11.7766 0.468398C11.4841 0.175898 11.0116 0.175898 10.7191 0.468398L9.34655 1.8409L12.1591 4.6534L13.5316 3.2809C13.8241 2.9884 13.8241 2.5159 13.5316 2.2234L11.7766 0.468398Z"
              fill="#7B7B7B"
            />
          </svg>

          <div>Add Note</div>
        </NoteWrapper>
      )}
      <ButtonWrapper>
        <Button type="primary" text="Confirm donation" onClick={handleDonate} />
      </ButtonWrapper>
    </Container>
  );
};

export default ConfirmDirect;
