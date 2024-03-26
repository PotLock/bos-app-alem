import RegistrySDK from "../SDK/registry";

const getProjectByProjectId = (projectId: string) => {
  return RegistrySDK.getProjectById(projectId);
};

export default getProjectByProjectId;
