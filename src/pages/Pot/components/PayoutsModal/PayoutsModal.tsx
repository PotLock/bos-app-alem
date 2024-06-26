import { Big, useMemo, useState } from "alem";
import PotSDK from "@app/SDK/pot";
import Button from "@app/components/Button";
import Text from "@app/components/Inputs/Text/Text";
import Alert from "@app/modals/ModalDonation/Banners/Alert";
import ModalOverlay from "@app/modals/ModalOverlay";
import { CalculatedPayout } from "@app/types";
import _address from "@app/utils/_address";
import { ButtonWrapper, Container, PayoutItem, PayoutsView, Title, Total, ExitIcon, TableHeader } from "./styles";

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
  const [assigendWeights, setAssignedWeights] = useState<Record<string, number>>({});
  const [qfWeight, setQfWeight] = useState("100");
  const [jdgWeight, setJdgWeight] = useState("0");
  const [error, setError] = useState("");

  const calcNear = (amount: string) => Big(amount).div(Big(10).pow(24)).toNumber().toFixed(2);
  const calcYoctos = (amount: string) => new Big(amount).mul(new Big(10).pow(24)).toString();

  const sumAmount = (payouts: any) => {
    let sum = Big(0);
    payouts.forEach((payout: any) => {
      sum = sum.plus(Big(payout.matchingAmount || payout.amount));
    });
    return sum.toString();
  };
  // payouts.reduce(
  //   (acc: any, payout: any) =>
  //     Big(acc)
  //       .plus(new Big(payout.matchingAmount || payout.amount))
  //       .toString(),
  //   0,
  // );

  const [originalTotalAmountYoctos, originalPayoutList] = useMemo(() => {
    const totalAmount = sumAmount(Object.values(originalPayouts));
    const payoutsArr = Object.entries(originalPayouts).map(([projectId, { matchingAmount }]: any) => ({
      project_id: projectId,
      amount: calcNear(matchingAmount),
    }));
    return [totalAmount, payoutsArr];
  }, [originalPayouts]);

  const originalTotalAmount = calcNear(originalTotalAmountYoctos);

  const [payoutsList, totalAmount] = useMemo(() => {
    const payoutsArr = Object.entries(payouts).map(([projectId, { matchingAmount }]: any) => ({
      project_id: projectId,
      amount: calcNear(matchingAmount),
    }));

    const totalAmountYoctos = sumAmount(Object.values(payouts));

    const totalAmount = calcNear(totalAmountYoctos);

    return [payoutsArr, totalAmount];
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

  // get the final amount and the list of assigned weights calculations
  const [finalPayoutList, finalAmountNear, sumAssignedWeightsCalc, remainder] = useMemo(() => {
    let finalAmount = Big(0);
    let sumAssignedWeightsCalc = 0;

    const payoutList = Object.entries(payouts).map(([projectId, { matchingAmount }]: any) => {
      const qfWeightCalc = Big(matchingAmount).mul(parseFloat(qfWeight) / 100);

      const jdWeightCalc = Big(originalTotalAmountYoctos)
        .mul((assigendWeights[projectId] || 0) * parseFloat(jdgWeight))
        .div(10e4);
      const projectFinalAmount = qfWeightCalc.add(jdWeightCalc);
      finalAmount = finalAmount.plus(projectFinalAmount);

      return {
        project_id: projectId,
        amount: projectFinalAmount.toString(),
      };
    });

    const remainderYoctos = Big(originalTotalAmountYoctos).minus(finalAmount).toNumber();
    if (remainderYoctos < 0) setError("The payout's total can not be greater than the original amount.");
    else setError("");
    const remainder = calcNear(remainderYoctos.toString());

    return [payoutList, calcNear(finalAmount.toString()), sumAssignedWeightsCalc, remainder];
  }, [assigendWeights, payoutsList, qfWeight, jdgWeight]);

  const handlePayout = () => {
    let payoutsArr = finalPayoutList.filter((payout) => payout.amount !== "0");

    let yoctos = sumAmount(payoutsArr);

    const remainder = Big(originalTotalAmountYoctos).minus(yoctos);

    payoutsArr[0].amount = Big(payoutsArr[0].amount).plus(remainder).toString();

    yoctos = sumAmount(payoutsArr);

    console.log("check if the original amount equal to the new one", Big(yoctos).cmp(Big(originalTotalAmountYoctos)));

    PotSDK.chefSetPayouts(potId, payoutsArr);
  };

  const sumWeight = Object.values(assigendWeights)
    .filter((value) => !isNaN(value))
    .reduce((total, num) => total + num, 0);

  return (
    <ModalOverlay overlayStyle={{ padding: "0" }} contentStyle={{ height: "100%", maxWidth: "100%" }}>
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
        {/* <Total>
          <div className="original">Total amount</div>
          <div className="amount">
            {totalAmount} / <span>{originalTotalAmount} N</span>
          </div>
        </Total> */}
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
        <div
          style={{
            display: "flex",
            gap: "1rem",
            maxWidth: "300px",
          }}
        >
          <Text
            label="QF Weight"
            percent={true}
            onChange={(value) => {
              setQfWeight(value);
              setJdgWeight((100 - parseFloat(value)).toString());
            }}
            value={qfWeight}
          />
          <Text
            label="Judges Weights"
            percent={true}
            onChange={(value) => {
              setJdgWeight(value);
              setQfWeight((100 - parseFloat(value)).toString());
            }}
            value={jdgWeight}
          />
        </div>
        <TableHeader>
          <div>Project</div>
          <div>Actual QF</div>
          <div>QF Override</div>
          <div>QF Weight Adjusted</div>
          <div>Assigned Weight (%)</div>
          <div>Assigned Weight Calculation</div>
          <div>Final Calculation</div>
        </TableHeader>
        <PayoutsView>
          {payoutsList.map(({ project_id, amount }, idx) => {
            const qfWeightCalc = parseFloat(amount) * (parseFloat(qfWeight) / 100);
            const jdWeightCalc =
              (parseFloat(originalTotalAmount) * (assigendWeights[project_id] || 0) * parseFloat(jdgWeight)) / 10000;

            const finalAmount = qfWeightCalc + jdWeightCalc;
            return (
              <PayoutItem>
                {/* Project address */}
                <div className="id">{_address(project_id, 15)}</div>
                {/* Origial Payout */}
                <Text disabled value={originalPayoutList[idx].amount} />
                {/* Overide Payout */}
                <Text onChange={(amount) => handleChange(project_id, amount)} defaultValue={amount} />
                {/* QF Weight Adjusted */}
                <Text disabled value={qfWeightCalc.toString()} />
                {/* Assigned Weight */}
                <Text
                  placeholder="0.00"
                  onChange={(value) =>
                    setAssignedWeights({
                      ...assigendWeights,
                      [project_id]: parseFloat(value),
                    })
                  }
                  percent={true}
                />
                {/* Assigned Weight Calculation */}
                <Text disabled value={jdWeightCalc.toString()} />
                {/* Final Calculation */}
                <Text disabled value={finalAmount.toString()} />
              </PayoutItem>
            );
          })}
        </PayoutsView>
        <TableHeader>
          <div></div>
          <div>{originalTotalAmount} N</div>
          <div>{totalAmount} N</div>
          <div>{(parseFloat(originalTotalAmount) * (parseFloat(qfWeight) / 100)).toFixed(2)} N</div>
          <div>{sumWeight} %</div>
          <div>{sumAssignedWeightsCalc.toFixed(2)} N</div>
          <div>{finalAmountNear} N</div>
        </TableHeader>
      </Container>
    </ModalOverlay>
  );
};

export default PayoutsModal;
