import { getAlemEnvironment } from "alem";

const potfactoryContractId =
  getAlemEnvironment() === "staging" ? "potfactory.staging.potlock.near" : "v1.potfactory.potlock.near";

const PotFactorySDK = {
  getContractId: () => potfactoryContractId,
  getConfig: () => {
    return Near.view(potfactoryContractId, "get_config", {});
  },
  getPots: () => {
    return Near.view(potfactoryContractId, "get_pots", {});
  },
  asyncGetPots: () => {
    return Near.asyncView(potfactoryContractId, "get_pots", {});
  },
  getProtocolConfig: () => {
    return Near.view(potfactoryContractId, "get_protocol_config", {});
  },
  canUserDeployPot: (accountId) => {
    const config = PotFactorySDK.getConfig();
    if (config) {
      return !config.require_whitelist || config.whitelisted_deployers.includes(accountId);
    }
  },
};

export default PotFactorySDK;
