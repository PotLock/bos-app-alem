import { Big, useMemo, useState } from "alem";
import PotSDK from "@app/SDK/pot";
import Button from "@app/components/Button";
import Text from "@app/components/Inputs/Text/Text";
import Alert from "@app/modals/ModalDonation/Banners/Alert";
import ModalOverlay from "@app/modals/ModalOverlay";
import { CalculatedPayout } from "@app/types";
import _address from "@app/utils/_address";
import { ButtonWrapper, Container, PayoutItem, PayoutsView, Title, Total, ExitIcon } from "./styles";

const PayoutsModal = ({
  originalPayouts,
  setPayoutsToProcess,
  potId,
}: {
  originalPayouts: Record<string, CalculatedPayout>;
  setPayoutsToProcess: (payouts: null) => void;
  potId: string;
}) => {
  const [payouts, setPayouts] = useState(originalPayouts);
  const [error, setError] = useState("");

  const calcNear = (amount: string) => Big(amount).div(Big(10).pow(24)).toNumber().toFixed(2);
  const calcYoctos = (amount: string) => new Big(amount).mul(new Big(10).pow(24)).toString();

  const sumAmount = (payouts: any) =>
    payouts.reduce(
      (acc: any, payout: any) =>
        Big(acc)
          .plus(new Big(payout.matchingAmount || payout.amount))
          .toString(),
      0,
    );

  const originalTotalAmountYoctos = useMemo(() => sumAmount(Object.values(originalPayouts)), [originalPayouts]);

  const originalTotalAmount = calcNear(originalTotalAmountYoctos);

  const [payoutsList, totalAmount, remainder] = useMemo(() => {
    const payoutsArr = Object.entries(payouts).map(([projectId, { matchingAmount }]: any) => ({
      project_id: projectId,
      amount: calcNear(matchingAmount),
    }));

    const totalAmountYoctos = sumAmount(Object.values(payouts));

    const totalAmount = calcNear(totalAmountYoctos);

    const remainderYoctos = Big(originalTotalAmountYoctos).minus(Big(totalAmountYoctos)).toNumber();
    if (remainderYoctos < 0) setError("The payout's total can not be greater than the original amount.");
    else setError("");
    const remainder = calcNear(remainderYoctos.toString());

    return [payoutsArr, totalAmount, remainder, remainderYoctos];
  }, [payouts]);

  const handleChange = (projectId: string, amount: string) => {
    setPayouts({
      ...payouts,
      [projectId]: {
        ...payouts[projectId],
        matchingAmount: calcYoctos(amount),
      },
    });
  };

  const handlePayout = () => {
    let payoutsArr = Object.entries(payouts)
      .map(([projectId, { matchingAmount }]: any) => ({
        project_id: projectId,
        amount: matchingAmount,
      }))
      .filter((payout) => payout.amount !== "0");
    let yoctos = sumAmount(payoutsArr);

    const remainder = Big(originalTotalAmountYoctos).minus(Big(yoctos));

    payoutsArr[0].amount = Big(payoutsArr[0].amount).plus(remainder).toString();

    yoctos = sumAmount(payoutsArr);

    console.log("check if the original amount equal to the new one", Big(yoctos).cmp(Big(originalTotalAmountYoctos)));

    PotSDK.chefSetPayouts(potId, payoutsArr);
  };

  return (
    <ModalOverlay>
      <Container>
        <ExitIcon>
          <svg
            onClick={() => setPayoutsToProcess(null)}
            className="close-icon"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
              fill="#000000"
            />
          </svg>
        </ExitIcon>
        <Title>{potId}</Title>
        <Total>
          <div className="original">Total amount</div>
          <div className="amount">
            {totalAmount} / <span>{originalTotalAmount} N</span>
          </div>
        </Total>
        <Total>
          <div className="original">Remainder</div>
          <div className="amount">{remainder} N</div>
        </Total>
        {error && (
          <Alert
            style={{
              marginTop: "0",
            }}
            error={error}
          />
        )}
        <ButtonWrapper>
          <Button onClick={handlePayout} isDisabled={!!error}>
            Set Payouts
          </Button>
        </ButtonWrapper>
        <PayoutsView>
          {payoutsList.map(({ project_id, amount }) => (
            <PayoutItem>
              <div className="id">{_address(project_id, 20)}</div>
              <Text
                containerStyles={{
                  width: "120px",
                }}
                onChange={(amount) => handleChange(project_id, amount)}
                defaultValue={amount}
              />
            </PayoutItem>
          ))}
        </PayoutsView>
      </Container>
    </ModalOverlay>
  );
};

export default PayoutsModal;
