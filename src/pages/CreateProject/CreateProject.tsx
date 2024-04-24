import { useParams } from "alem";
import Header from "./components/Header/Header";
import CreateForm from "./components/CreateForm/CreateForm";

const CreateProject = () => {
  const { tab } = useParams();
  const edit = tab === "editproject";

  return (
    <>
      <Header
        {...{
          title1: edit ? "Edit your project" : "Create new project",
          description: `${
            edit ? "Update your " : "Create a "
          } profile for your impact project to receive direct donations, qualify for funding rounds, join NEAR's accelerator, and get discovered across social platforms.`,
          centered: false,
          containerStyle: {
            background: "#FEF6EE",
          },
        }}
      />
      <CreateForm edit={edit} />
    </>
  );
};

export default CreateProject;
