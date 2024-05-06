import { State, state, useParams, Big, Social, Near, context } from "alem";
import Button from "@app/components/Button";
import CheckBox from "@app/components/Inputs/Checkbox/Checkbox";
import Text from "@app/components/Inputs/Text/Text";
import TextArea from "@app/components/Inputs/TextArea/TextArea";
import ProfileImage from "@app/components/mob.near/ProfileImage";
import constants from "@app/constants";
import ModalOverlay from "@app/modals/ModalOverlay";
import { PotDetail } from "@app/types";
import _address from "@app/utils/_address";
import doesUserHaveDaoFunctionCallProposalPermissions from "@app/utils/doesUserHaveDaoFunctionCallProposalPermissions";
import hrefWithParams from "@app/utils/hrefWithParams";
import yoctosToNear from "@app/utils/yoctosToNear";
import { FeeText, Label, ModalTitle, Row, TextBold, UserChipLink } from "./styles";

type Props = {
  potDetail: PotDetail;
  onClose: () => void;
};

const FundModal = ({ potDetail, onClose }: Props) => {
  const { referrerId, potId } = useParams();

  const { MAX_DONATION_MESSAGE_LENGTH, SUPPORTED_FTS, ONE_TGAS } = constants;

  const {
    protocol_config_provider,
    chef_fee_basis_points,
    chef,
    base_currency,
    min_matching_pool_donation_amount,
    referral_fee_matching_pool_basis_points,
  } = potDetail;

  State.init({
    matchingPoolDonationAmountNear: "",
    matchingPoolDonationAmountNearError: "",
    matchingPoolDonationMessage: "",
    matchingPoolDonationMessageError: "",
    bypassProtocolFee: false,
    bypassChefFee: false,
    fundAsDao: false,
    daoAddress: "",
    daoAddressError: "",
    daoPolicy: {},
  });

  const {
    matchingPoolDonationAmountNear,
    matchingPoolDonationAmountNearError,
    matchingPoolDonationMessage,
    matchingPoolDonationMessageError,
    bypassProtocolFee,
    bypassChefFee,
    fundAsDao,
    daoAddress,
    daoAddressError,
  } = state;

  Big.PE = 100;
  const FIFTY_TGAS = "50000000000000";
  const THREE_HUNDRED_TGAS = "300000000000000";
  const MIN_DAO_PROPOSAL_DEPOSIT_FALLBACK = "100000000000000000000000"; // 0.1N

  const protocolConfigContractId = protocol_config_provider.split(":")[0];
  const protocolConfigViewMethodName = protocol_config_provider.split(":")[1];
  const protocolConfig: any = Near.view(protocolConfigContractId, protocolConfigViewMethodName, {});

  const protocolFeeRecipientProfile = Social.getr(`${protocolConfig?.account_id}/profile`);
  const chefProfile = Social.getr(`${chef}/profile`);

  const chefFeeAmountNear = bypassChefFee
    ? 0
    : (matchingPoolDonationAmountNear * potDetail?.chef_fee_basis_points) / 10_000 || 0;

  const protocolFeeAmountNear = bypassProtocolFee
    ? 0
    : (matchingPoolDonationAmountNear * protocolConfig?.basis_points) / 10_000 || 0;
  const referrerFeeAmountNear = referrerId
    ? (matchingPoolDonationAmountNear * referral_fee_matching_pool_basis_points) / 10_000 || 0
    : 0;

  const handleMatchingPoolDonation = () => {
    const args: any = {
      message: matchingPoolDonationMessage,
      matching_pool: true,
      referrer_id: referrerId || null,
      bypass_protocol_fee: bypassProtocolFee,
    };
    if (state.bypassChefFee) {
      args.custom_chef_fee_basis_points = 0;
    }

    const amountFloat = parseFloat(matchingPoolDonationAmountNear || 0);
    if (!amountFloat) {
      State.update({ matchingPoolDonationAmountNearError: "Invalid amount" });
      return;
    }
    const amountIndivisible = SUPPORTED_FTS[base_currency.toUpperCase()].toIndivisible(amountFloat);
    let transactions = [
      {
        contractName: potId,
        methodName: "donate",
        deposit: amountIndivisible,
        args,
        gas: ONE_TGAS.mul(100),
      },
    ];

    // if it is a DAO, we need to convert transactions to DAO function call proposals
    if (state.fundAsDao) {
      const clonedTransactions = JSON.parse(JSON.stringify(transactions));
      transactions = clonedTransactions.map((tx: any) => {
        const action = {
          method_name: tx.methodName,
          gas: FIFTY_TGAS,
          deposit: tx.deposit ? tx.deposit.toString() : "0",
          args: Buffer.from(JSON.stringify(tx.args), "utf-8").toString("base64"),
        };
        return {
          ...tx,
          contractName: state.daoAddress,
          methodName: "add_proposal",
          args: {
            proposal: {
              description: `Contribute to matching pool for ${potDetail.pot_name} pot (${potId}) on Potlock`,
              kind: {
                FunctionCall: {
                  receiver_id: tx.contractName,
                  actions: [action],
                },
              },
            },
          },
          deposit: state.daoPolicy.proposal_bond || MIN_DAO_PROPOSAL_DEPOSIT_FALLBACK,
          gas: THREE_HUNDRED_TGAS,
        };
      });
    }

    Near.call(transactions);
    // NB: we won't get here if user used a web wallet, as it will redirect to the wallet
    // <---- EXTENSION WALLET HANDLING ----> // TODO: implement
  };

  const disabled =
    (fundAsDao && !daoAddress) ||
    daoAddressError ||
    !matchingPoolDonationAmountNear ||
    !!matchingPoolDonationAmountNearError ||
    !parseFloat(matchingPoolDonationAmountNear);

  return (
    <ModalOverlay onOverlayClick={onClose}>
      <CheckBox
        label="Fund as DAO"
        id="fundAsDaoSelector"
        checked={fundAsDao}
        onClick={(e: any) => {
          State.update({ fundAsDao: e.target.checked });
        }}
      />

      {fundAsDao && (
        <Text
          inputStyles={{
            background: "#FAFAFA",
          }}
          placeholder="Enter DAO address"
          value={daoAddress}
          onChange={(daoAddress) =>
            State.update({
              daoAddress: daoAddress.trim().toLowerCase(),
            })
          }
          validate={() => {
            Near.asyncView(daoAddress, "get_policy", {})
              .then((policy) => {
                if (!policy) {
                  State.update({ daoAddressError: "Invalid DAO address" });
                }
                if (!doesUserHaveDaoFunctionCallProposalPermissions(context.accountId || "", policy)) {
                  State.update({
                    daoAddressError: "Your account does not have permission to create proposals",
                  });
                } else {
                  State.update({ daoAddressError: "", daoPolicy: policy });
                }
              })
              .catch((e) => {
                State.update({ daoAddressError: "Invalid DAO address" });
              });
          }}
          error={daoAddressError}
        />
      )}
      <ModalTitle>
        Enter matching pool contribution amount in NEAR
        {["0", "1"].includes(min_matching_pool_donation_amount)
          ? "(no minimum)"
          : `(Min. ${yoctosToNear(min_matching_pool_donation_amount)})`}
      </ModalTitle>
      <Text
        inputStyles={{
          background: "#FAFAFA",
        }}
        placeholder="Enter amount here in NEAR"
        value={matchingPoolDonationAmountNear}
        onChange={(matchingPoolDonationAmountNear) =>
          State.update({
            matchingPoolDonationAmountNear,
          })
        }
        validate={() => {
          // TODO: add validation logic here
          State.update({ matchingPoolDonationAmountNearError: "" });
        }}
        error={matchingPoolDonationAmountNearError}
      />
      <TextArea
        noLabel={true}
        inputRows={5}
        inputStyle={{
          marginTop: "0.45rem",
          background: "#FAFAFA",
        }}
        placeholder="Enter an optional message"
        value={matchingPoolDonationMessage}
        onChange={(matchingPoolDonationMessage: any) => State.update({ matchingPoolDonationMessage })}
        validate={() => {
          if (matchingPoolDonationMessage.length > MAX_DONATION_MESSAGE_LENGTH) {
            State.update({
              matchingPoolDonationMessageError: `Message must be less than ${MAX_DONATION_MESSAGE_LENGTH} characters`,
            });
            return;
          }

          State.update({ matchingPoolDonationMessageError: "" });
        }}
        error={matchingPoolDonationMessageError}
      />

      <Row>
        <CheckBox
          id="bypassProtocolFeeSelector"
          checked={bypassProtocolFee}
          onClick={(e: any) => {
            State.update({ bypassProtocolFee: e.target.checked });
          }}
        />

        <Label htmlFor="bypassProtocolFeeSelector">
          Bypass {protocolConfig?.basis_points / 100 || "-"}% protocol fee to{" "}
          <UserChipLink href={hrefWithParams(`?tab=profile&accountId=${protocolConfig?.account_id}`)} target="_blank">
            <ProfileImage
              accountId={protocolConfig?.account_id}
              style={{
                height: "12px",
                width: "12px",
              }}
            />

            <TextBold>{_address(protocolFeeRecipientProfile?.name || protocolConfig?.account_id)}</TextBold>
          </UserChipLink>
        </Label>
      </Row>
      {chef && chef_fee_basis_points > 0 && (
        <Row style={{ marginTop: "6px" }}>
          <CheckBox
            id="bypassChefFeeSelector"
            checked={bypassChefFee}
            onClick={(e: any) => {
              State.update({ bypassChefFee: e.target.checked });
            }}
          />

          <Label htmlFor="bypassChefFeeSelector">
            Bypass {chef_fee_basis_points / 100 || "-"}% chef fee to
            <UserChipLink href={hrefWithParams(`?tab=profile&accountId=${chef}`)} target="_blank">
              <ProfileImage
                accountId={chef}
                style={{
                  height: "12px",
                  width: "12px",
                }}
              />

              <TextBold>{chefProfile?.name || chef}</TextBold>
            </UserChipLink>
          </Label>
        </Row>
      )}
      <Row style={{ marginTop: "12px" }}>
        <FeeText>Protocol fee: {protocolFeeAmountNear} NEAR</FeeText>
      </Row>
      {chef && chef_fee_basis_points > 0 && (
        <Row style={{ marginTop: "12px" }}>
          <FeeText>Chef fee: {chefFeeAmountNear} NEAR</FeeText>
        </Row>
      )}
      <Row style={{ marginTop: "6px" }}>
        {referrerId && (
          <FeeText>
            Referrer fee (to {referrerId}): {referrerFeeAmountNear} NEAR
          </FeeText>
        )}
      </Row>
      <Row style={{ marginTop: "6px" }}>
        <FeeText>
          Net donation amount:{" "}
          {(matchingPoolDonationAmountNear - protocolFeeAmountNear - chefFeeAmountNear - referrerFeeAmountNear).toFixed(
            2,
          )}{" "}
          NEAR
        </FeeText>
      </Row>
      <Row style={{ justifyContent: "flex-end", marginTop: "12px" }}>
        <Button isDisabled={disabled} onClick={handleMatchingPoolDonation}>
          {`${fundAsDao ? "Create proposal to contribute " : "Contribute"}${
            matchingPoolDonationAmountNear ? ` ${matchingPoolDonationAmountNear} ${base_currency.toUpperCase()}` : ""
          } to matching pool`}
        </Button>
      </Row>
    </ModalOverlay>
  );
};

export default FundModal;
