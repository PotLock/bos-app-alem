import { Big, useMemo, useState, Tooltip, OverlayTrigger, context, Near } from "alem";
import Button from "@app/components/Button";
import Text from "@app/components/Inputs/Text/Text";
import TextArea from "@app/components/Inputs/TextArea/TextArea";
import Alert from "@app/modals/ModalDonation/Banners/Alert";
import ModalOverlay from "@app/modals/ModalOverlay";
import { CalculatedPayout } from "@app/types";
import _address from "@app/utils/_address";
import { payoutDescription } from "./payoutDescription";
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
  const [message, setMessage] = useState("");

  const calcNear = (amount: string) => Big(amount).div(Big(10).pow(24)).toNumber().toFixed(2);
  const calcYoctos = (amount: string) => new Big(amount).mul(new Big(10).pow(24)).toString();

  const sumAmount = (payouts: any) => {
    let sum = Big(0);
    payouts.forEach((payout: any) => {
      sum = sum.plus(Big(payout.matchingAmount || payout.amount));
    });
    return sum.toString();
  };

  const [originalTotalAmountYoctos, originalPayoutList] = useMemo(() => {
    const totalAmount = sumAmount(Object.values(originalPayouts));
    const payoutsArr = Object.entries(originalPayouts).map(([projectId, { matchingAmount }]: any) => ({
      project_id: projectId,
      amount: calcNear(matchingAmount),
    }));
    return [totalAmount, payoutsArr];
  }, [originalPayouts]);

  const originalTotalAmount = calcNear(originalTotalAmountYoctos);

  const handleChange = (projectId: string, amount: string) => {
    setPayouts({
      ...payouts,
      [projectId]: {
        ...payouts[projectId],
        matchingAmount: calcYoctos(amount || "0"),
      },
    });
  };

  // get the final amount and the list of assigned weights calculations
  const [payoutList, finalAmountNear, sumAssignedWeightsCalc, remainder, post, totalAmount] = useMemo(() => {
    let finalAmount = Big(0);
    let sumAssignedWeightsCalc = 0;

    let post = `Pot Id: ${potId}\n\nTotal Pot: 11149.11\n\nQF Weight:${qfWeight}%\n\nJudges Weights:${jdgWeight}%\n\n| Project | Actual QF | QF Override | QF Weight Adjusted | Assigned Weight (%) | Assigned Weight Calculation | Final Calculation |\n| --- | --- | --- | --- | --- | --- | --- |\n`;

    const payoutList = Object.entries(payouts).map(([projectId, { matchingAmount }], idx: any) => {
      const qfWeightCalc = Big(matchingAmount)
        .mul(parseFloat(qfWeight) / 100)
        .round();
      const jdWeightCalc = Big(originalTotalAmountYoctos)
        .mul((assigendWeights[projectId] || 0) * parseFloat(jdgWeight))
        .div(10e3)
        .round();
      const projectFinalAmount = qfWeightCalc.add(jdWeightCalc);
      finalAmount = finalAmount.plus(projectFinalAmount);

      // post calculation
      const nearAmount = calcNear(matchingAmount);
      const qfWeightCalcNear = parseFloat(calcNear(qfWeightCalc.toString()));
      const jdWeightCalcNear = parseFloat(calcNear(jdWeightCalc.toString()));

      const finalAmountNear = qfWeightCalcNear + jdWeightCalcNear;

      post += `| ${projectId} | ${originalPayoutList[idx].amount} | ${nearAmount} | ${qfWeightCalcNear} | ${
        assigendWeights[projectId] || "0.00"
      }%  | ${jdWeightCalcNear} | ${finalAmountNear} |\n`;

      return {
        project_id: projectId,
        jdWeightCalc: jdWeightCalcNear,
        qfWeightCalc: qfWeightCalcNear,
        amount: projectFinalAmount.toString(),
        nearAmount: finalAmountNear.toString(),
      };
    });
    // total amount in Near
    const remainderYoctos = Big(originalTotalAmountYoctos).minus(finalAmount).toNumber();
    if (remainderYoctos < 0) setError("The payout's total can not be greater than the original amount.");
    else setError("");
    const remainder = calcNear(remainderYoctos.toString());

    // total amount in Near
    const totalAmountYoctos = sumAmount(Object.values(payouts));
    const totalAmount = calcNear(totalAmountYoctos);

    return [payoutList, calcNear(finalAmount.toString()), sumAssignedWeightsCalc, remainder, post, totalAmount];
  }, [assigendWeights, payouts, qfWeight, jdgWeight]);

  const handlePayout = () => {
    let payoutsArr = payoutList
      .filter((payout) => payout.amount !== "0")
      .map(({ project_id, amount }) => ({
        project_id,
        amount,
      }));
    payoutsArr.sort((a, b) => Big(b.amount).minus(a.amount).toNumber());
    let yoctos = sumAmount(payoutsArr);

    const remainder = Big(originalTotalAmountYoctos).minus(yoctos);

    payoutsArr[0].amount = Big(payoutsArr[0].amount).plus(remainder).toString();

    yoctos = sumAmount(payoutsArr);

    const payoutTrx = {
      contractName: potId,
      methodName: "chef_set_payouts",
      args: { payouts: payoutsArr },
      deposit: "1",
      gas: "300000000000000",
    };

    const notes = `${message}\n${post}`;

    const main = {
      type: "md",
      text: notes,
    };

    const SOCIAL_CONTRACT_ID = "social.near";
    const socialArgs = {
      data: {
        [context.accountId || ""]: {
          post: {
            main: JSON.stringify(Object.assign({ undefined }, main)),
          },
          index: {
            post: JSON.stringify({
              key: "main",
              value: {
                type: "md",
              },
            }),
          },
        },
      },
    };
    const socialTransaction: any = {
      contractName: SOCIAL_CONTRACT_ID,
      methodName: "set",
      args: socialArgs,
    };

    let depositFloat = JSON.stringify(socialArgs).length * 0.00015;
    socialTransaction.deposit = Big(depositFloat).mul(Big(10).pow(24));

    Near.call([socialTransaction, payoutTrx]);
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
              setQfWeight(value || "0");
              setJdgWeight((100 - parseFloat(value || "0")).toString());
            }}
            value={qfWeight}
          />
          <Text
            label="Judges Weights"
            percent={true}
            onChange={(value) => {
              setJdgWeight(value || "0");
              setQfWeight((100 - parseFloat(value || "0")).toString());
            }}
            value={jdgWeight}
          />
        </div>
        {/* <div className="my-3">
          <Compose initialText={post} />
        </div> */}
        <TextArea label="message" onChange={(value: any) => setMessage(value)} value={message} placeholder="Notes" />
        <TableHeader>
          {payoutDescription.map(({ title, description }) =>
            description ? (
              <OverlayTrigger key={title} placement="top" overlay={description ? <Tooltip>{description}</Tooltip> : ""}>
                <div> {title}</div>
              </OverlayTrigger>
            ) : (
              <div key={title}> {title}</div>
            ),
          )}
        </TableHeader>
        <PayoutsView>
          {payoutList.map(({ project_id, nearAmount, qfWeightCalc, jdWeightCalc }, idx) => {
            return (
              <PayoutItem>
                {/* Project address */}
                <div className="id">{_address(project_id, 15)}</div>
                {/* Origial Payout */}
                <Text disabled value={originalPayoutList[idx].amount} />
                {/* Overide Payout */}
                <Text onChange={(amount) => handleChange(project_id, amount)} defaultValue={nearAmount} />
                {/* QF Weight Adjusted */}
                <Text disabled value={qfWeightCalc.toString()} />
                {/* Assigned Weight */}
                <Text
                  placeholder="0.00"
                  onChange={(value) =>
                    setAssignedWeights({
                      ...assigendWeights,
                      [project_id]: parseFloat(value || "0"),
                    })
                  }
                  percent={true}
                />
                {/* Assigned Weight Calculation */}
                <Text disabled value={jdWeightCalc.toString()} />
                {/* Final Calculation */}
                <Text disabled value={nearAmount} />
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
