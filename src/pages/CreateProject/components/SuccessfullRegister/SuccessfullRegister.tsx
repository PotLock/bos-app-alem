import { context } from "alem";
import Button from "@app/components/Button";
import hrefWithParams from "@app/utils/hrefWithParams";
import { ButtonsContainer, Container } from "./styles";

const SuccessfullRegister = ({ registeredProject }: { registeredProject: any }) => {
  return (
    <Container>
      <h1 style={{ textAlign: "center" }}>You've successfully registered!</h1>
      <ButtonsContainer>
        <Button
          {...{
            isDisabled: false,
            href: hrefWithParams(`?tab=project&projectId=${registeredProject?.registrant_id || context.accountId}`),
          }}
        >
          View your project
        </Button>
        <Button
          {...{
            varient: "tonal",
            isDisabled: false,
            href: hrefWithParams(`?tab=projects`),
          }}
        >
          View all projects
        </Button>
      </ButtonsContainer>
    </Container>
  );
};

export default SuccessfullRegister;
