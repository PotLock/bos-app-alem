import { Big, state, Near, context, State } from "alem";
import constants from "@app/constants";
import { PotDetail } from "@app/types";
import PotSDK from "@app/SDK/pot";

const handleSendApplication = (potId: string, potDetail: PotDetail, setApplicationSuccess: any) => {
  // Constents
  const FIFTY_TGAS = "50000000000000";
  const MIN_PROPOSAL_DEPOSIT_FALLBACK = "100000000000000000000000"; // 0.1N
  const THREE_HUNDRED_TGAS = "300000000000000";
  const {
    ONE_TGAS,
    SUPPORTED_FTS: { NEAR },
  } = constants;

  const args = {
    message: state.applicationMessage,
  };
  let deposit = NEAR.toIndivisible("0.01");
  const extraDeposit = Big(state.applicationMessage.length * 0.0001).mul(Big(10).pow(24));
  deposit = deposit.plus(extraDeposit);

  let transactions = [
    {
      contractName: potId,
      methodName: "apply",
      deposit,
      args,
      gas: ONE_TGAS.mul(100),
    },
  ];

  // if it is a DAO, we need to convert transactions to DAO function call proposals
  if (state.isDao) {
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
            description: `Application to PotLock pot: ${potDetail.pot_name} (${potId})`,
            kind: {
              FunctionCall: {
                receiver_id: tx.contractName,
                actions: [action],
              },
            },
          },
        },
        deposit: state.daoPolicy.proposal_bond || MIN_PROPOSAL_DEPOSIT_FALLBACK,
        gas: THREE_HUNDRED_TGAS,
      };
    });
  }

  Near.call(transactions);
  // NB: we won't get here if user used a web wallet, as it will redirect to the wallet
  // <---- EXTENSION WALLET HANDLING ---->
  // poll for updates
  const pollIntervalMs = 1000;
  // const totalPollTimeMs = 60000; // consider adding in to make sure interval doesn't run indefinitely
  const pollId = setInterval(() => {
    PotSDK.asyncGetApplications(potId).then((applications: any) => {
      const application = applications.find(
        (application: any) => application.project_id === (state.isDao ? state.daoAddress : context.accountId),
      );
      if (application) {
        clearInterval(pollId);
        setApplicationSuccess(true);
      }
    });
  }, pollIntervalMs);
};

export default handleSendApplication;
