import { Big, Near, State, context, state, useParams } from "alem";
import ListsSDK from "@app/SDK/lists";
import validateNearAddress from "@app/utils/validateNearAddress";
import getSocialData from "./getSocialData";
import { deepObjectDiff, projectDisabled } from "./helpers";

const handleCreateOrUpdateProject = (e: any) => {
  const { projectId, tab } = useParams();

  const edit = tab === "editproject";
  const SOCIAL_CONTRACT_ID = "social.near";
  const HORIZON_CONTRACT_ID = "nearhorizon.near";
  const FIFTY_TGAS = "50000000000000";
  const THREE_HUNDRED_TGAS = "300000000000000";
  const MIN_PROPOSAL_DEPOSIT_FALLBACK = "100000000000000000000000"; // 0.1N

  const isCreateProjectDisabled = projectDisabled();
  const accountId = projectId ? projectId : state.isDao ? state.daoAddress : context.accountId;

  const existingHorizonProject = Near.view(HORIZON_CONTRACT_ID, "get_project", {
    account_id: context.accountId,
  });
  const policy: any = Near.view(accountId, "get_policy", {});

  if (isCreateProjectDisabled) return;
  const daoAddressValid = state.isDao ? validateNearAddress(state.daoAddress) : true;
  if (!daoAddressValid) {
    State.update({
      daoAddressError: "Invalid NEAR account ID",
    });
    return;
  }
  const socialData = getSocialData();

  if (state.backgroundImage) {
    socialData.profile.backgroundImage = state.backgroundImage;
  }
  if (state.profileImage) {
    socialData.profile.image = state.profileImage;
  }

  const diff = deepObjectDiff(state.existingSocialData, socialData);

  const socialArgs = {
    data: {
      [accountId]: diff,
    },
  };

  const potlockRegistryArgs = {
    list_id: 1, // hardcoding to potlock registry list for now
  };
  const horizonArgs = { account_id: state.isDao ? state.daoAddress : context.accountId };

  // first, we have to get the account from social.near to see if it exists. If it doesn't, we need to add 0.1N to the deposit
  Near.asyncView(SOCIAL_CONTRACT_ID, "get_account", {
    account_id: state.isDao ? state.daoAddress : context.accountId,
  }).then((account) => {
    const socialTransaction: any = {
      contractName: SOCIAL_CONTRACT_ID,
      methodName: "set",
      args: socialArgs,
    };
    let depositFloat = JSON.stringify(socialArgs).length * 0.00015;
    if (!account) {
      depositFloat += 0.1;
    }
    socialTransaction.deposit = Big(depositFloat).mul(Big(10).pow(24));

    // instantiate transactions array that we will be passing to Near.call()
    let transactions = [socialTransaction];

    // if this is a creation action, we need to add the registry and horizon transactions
    if (!edit) {
      transactions.push(
        // register project on potlock
        {
          contractName: ListsSDK.getContractId(),
          methodName: "register_batch",
          deposit: Big(0.05).mul(Big(10).pow(24)),
          args: potlockRegistryArgs,
        },
      );
      if (!existingHorizonProject) {
        transactions.push(
          // register on NEAR Horizon
          {
            contractName: HORIZON_CONTRACT_ID,
            methodName: "add_project",
            args: horizonArgs,
          },
        );
      }
    }

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
              description: edit
                ? "Update project on Potlock (via NEAR Social)"
                : "Create project on Potlock (3 steps: Register information on NEAR Social, register on Potlock, and register on NEAR Horizon)",
              kind: {
                FunctionCall: {
                  receiver_id: tx.contractName,
                  actions: [action],
                },
              },
            },
          },
          deposit: policy.proposal_bond || MIN_PROPOSAL_DEPOSIT_FALLBACK,
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
      // This is an async request, not converting to SDK yet
      ListsSDK.asyncGetRegistration(null, context.accountId).then((_project: any) => {
        if (_project) {
          clearInterval(pollId);
          State.update({ registrationSuccess: true });
        }
      });
    }, pollIntervalMs);
  });
};

export default handleCreateOrUpdateProject;
