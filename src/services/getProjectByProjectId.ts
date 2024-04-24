import ListsSDK from "@app/SDK/lists";

const getProjectByProjectId = (projectId: string) => {
  return ListsSDK.getRegistration(null, projectId);
};

export default getProjectByProjectId;
