import {
  BreakdownItemContainer,
  BreakdownItemLeft,
  BreakdownItemRight,
  BreakdownItemText,
  Container,
  CurrencyHeader,
  CurrencyHeaderText,
  CurrencyIcon,
  ErrorText,
  Title,
  TotalContainer,
  TotalText,
} from "./styles";
import DonateSDK from "@app/SDK/donate";
import PotSDK from "@app/SDK/pot";
import { Big, Near, context, useMemo } from "alem";
import constants from "@app/constants";
import Button from "@app/components/Button";
import { useCart } from "@app/hooks/useCart";

const CheckoutBreakdown = (props: any) => {
  const { cart, clearCart } = useCart();

  const { SUPPORTED_FTS } = constants;

  const DONATION_CONTRACT_ID = DonateSDK.getContractId();

  Big.PE = 100;

  const MIN_REQUIRED_DONATION_AMOUNT_PER_PROJECT = 0.1;

  const [tokens, amountsByFt, totalAmount, donationTooSmall] = useMemo(() => {
    const tokens: any = {};
    const amountsByFt: any = {};
    let donationTooSmall = false;
    Object.entries(cart || {}).forEach(([projectId, { token, amount }]: any) => {
      const ft = token.text;
      if (!amountsByFt[ft]) amountsByFt[ft] = 0;
      amountsByFt[ft] += parseFloat(amount || 0);
      if (amountsByFt[ft] < MIN_REQUIRED_DONATION_AMOUNT_PER_PROJECT) donationTooSmall = true;
      tokens[ft] = token;
    });
    const totalAmount: any = Object.values(amountsByFt).reduce((acc: any, amount: any) => acc + amount, 0);
    return [tokens, amountsByFt, totalAmount, donationTooSmall];
  }, [props]);

  // console.log("amountsByFt: ", amountsByFt);
  // console.log("tokens: ", tokens);

  const handleDonate = () => {
    const transactions: any = [];
    let potIdContained: any;

    Object.entries(cart).forEach(([projectId, { token, amount, referrerId, note, potId }]: any) => {
      const isFtDonation = token.text != "NEAR";
      const amountIndivisible = Big(parseFloat(amount)).mul(Big(10).pow(isFtDonation ? token.decimals : 24));
      const args: any = {};
      if (isFtDonation) {
        args.receiver_id = DONATION_CONTRACT_ID;
        args.amount = amountIndivisible.toString();
        args.memo = JSON.stringify({
          recipient_id: projectId,
          referrer_id: referrerId || null,
          bypass_protocol_fee: false,
          message: note || null,
        });
      } else {
        // pot & generic contract args
        if (potId) args.project_id = projectId;
        else args.recipient_id = projectId;
        args.referrer_id = referrerId;
        args.message = note;
        // donation contract args
        // other
        potIdContained = potId;
      }
      transactions.push({
        contractName: isFtDonation ? token.id : potId ?? DONATION_CONTRACT_ID,
        methodName: isFtDonation ? "ft_transfer_call" : "donate",
        args,
        deposit: isFtDonation ? "1" : amountIndivisible.toString(),
        gas: "300000000000000",
      });
    });

    // if cart contains a non-NEAR token, add storage_deposit to beginning of transactions
    // for each non-NEAR donation: 0.008 base amount for donation storage + 0.0001 NEAR per character in message
    if (Object.keys(amountsByFt).some((ft) => ft !== "NEAR")) {
      const requiredDepositFloat = transactions.reduce((acc: any, { methodName, args }: any) => {
        if (methodName === "donate") return acc;
        const baseAmount = 0.008;
        const argsAmount = (args.message.length || 0) * 0.0001;
        return acc + baseAmount + argsAmount;
      }, 0);
      transactions.unshift({
        contractName: DONATION_CONTRACT_ID,
        methodName: "storage_deposit",
        args: {},
        deposit: Big(requiredDepositFloat).mul(Big(10).pow(24)),
        gas: "100000000000000",
      });
    }

    const now = Date.now();
    Near.call(transactions);
    // NB: we won't get here if user used a web wallet, as it will redirect to the wallet
    // <-------- EXTENSION WALLET HANDLING -------->
    // poll for updates
    // TODO: update this to also poll Pot contract
    const pollIntervalMs = 1000;
    // const totalPollTimeMs = 60000; // consider adding in to make sure interval doesn't run indefinitely
    const pollId = setInterval(() => {
      (potIdContained
        ? PotSDK.asyncGetDonationsForDonor(potIdContained, context.accountId)
        : DonateSDK.asyncGetDonationsForDonor(context.accountId)
      ).then((donations: any) => {
        // for each project, there should be a matching donation that occurred since now()
        const foundDonations = [];
        // go through donations, add to foundDonations list
        for (const donation of donations) {
          const { recipient_id, project_id, donated_at_ms, donated_at, total_amount } = donation;
          const matchingCartItem = cart[project_id || recipient_id];
          if (matchingCartItem && (donated_at_ms > now || donated_at > now)) {
            foundDonations.push(donation);
          }
        }
        if (foundDonations.length) {
          // donations found
          // display success message & clear cart
          clearInterval(pollId);
          props.updateSuccessfulDonationRecipientId(foundDonations[0].recipient_id);
          clearCart();
        }
      });
    }, pollIntervalMs);
  };

  return (
    <Container>
      <Title>Breakdown summary</Title>
      <CurrencyHeader>
        <CurrencyHeaderText>Currency</CurrencyHeaderText>
        <CurrencyHeaderText>Amount</CurrencyHeaderText>
      </CurrencyHeader>
      {Object.entries(amountsByFt).map(([ft, amount]: any) => {
        const amountFloat = parseFloat(amount || 0);
        return (
          <BreakdownItemContainer>
            <BreakdownItemLeft>
              {ft == "NEAR" ? (
                <CurrencyIcon src={SUPPORTED_FTS.NEAR.iconUrl} />
              ) : (
                <CurrencyIcon src={tokens[ft].icon} />
              )}
              <BreakdownItemText>{tokens[ft].text}</BreakdownItemText>
            </BreakdownItemLeft>
            <BreakdownItemRight>
              <BreakdownItemText>{amountFloat.toFixed(2)}</BreakdownItemText>
            </BreakdownItemRight>
          </BreakdownItemContainer>
        );
      })}
      {Object.keys(amountsByFt).length <= 1 &&
        amountsByFt.NEAR && ( // only show total if NEAR is the only currency being donated (otherwise it is inaccurate and confusing)
          <TotalContainer>
            <TotalText>Total</TotalText>
            <TotalText>{totalAmount.toFixed(2)}</TotalText>
          </TotalContainer>
        )}

      <Button
        {...{
          disabled: !Object.keys(cart).length || donationTooSmall || !context.accountId,
          onClick: handleDonate,
          style: {
            width: "100%",
          },
        }}
      >
        Process Donation{" "}
      </Button>

      {donationTooSmall && (
        <ErrorText>Minimum required donation per project is {MIN_REQUIRED_DONATION_AMOUNT_PER_PROJECT} N</ErrorText>
      )}
      {!context.accountId && <ErrorText>Please sign in to donate</ErrorText>}
    </Container>
  );
};

export default CheckoutBreakdown;
