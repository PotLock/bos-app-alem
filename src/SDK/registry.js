import { props } from "alem";

const _registryContractId = props.env === "staging" ? "registry.staging.potlock.near" : "registry.potlock.near";

const RegistrySDK = {
  getContractId: () => _registryContractId,
  getConfig: () => {
    return Near.view(_registryContractId, "get_config", {});
  },
  isRegistryAdmin: (accountId) => {
    const config = RegistrySDK.getConfig();
    return config.admins && config.admins.includes(accountId);
  },
  getProjects: () => {
    return Near.view(_registryContractId, "get_projects", {});
  },
  getProjectById: (projectId) => {
    return Near.view(_registryContractId, "get_project_by_id", { project_id: projectId });
  },
  asyncGetProjectById: (projectId) => {
    return Near.asyncView(_registryContractId, "get_project_by_id", { project_id: projectId });
  },
  isProjectApproved: (projectId) => {
    const project = RegistrySDK.getProjectById(projectId);
    return project && project.status === "Approved";
  },
  isUserRegistryAdmin: (accountId) => {
    return RegistrySDK.isRegistryAdmin(accountId);
  },
};

export default RegistrySDK;
