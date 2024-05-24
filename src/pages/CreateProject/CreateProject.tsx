import { context, useParams } from "alem";
import ListsSDK from "@app/SDK/lists";
import CreateForm from "./components/CreateForm/CreateForm";
import Header from "./components/Header/Header";

const CreateProject = () => {
  const { tab } = useParams();
  // const registeration = ListsSDK.getRegistration(null, context.accountId);
  const edit = tab === "editproject";

  return (
    <>
      <Header edit={edit} />
      <CreateForm edit={edit} />
    </>
  );
};

export default CreateProject;
