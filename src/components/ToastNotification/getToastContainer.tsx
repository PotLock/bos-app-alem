import { useEffect } from "alem";
import SuccessfulIcon from "@app/assets/svgs/SuccessfulIcon";
import ToastProvider from "@app/contexts/ToastProvider";
import { useToastNotification } from "@app/hooks/useToast";
import { Container, Description, Header } from "./styles";

const getToastContainer = () => {
  ToastProvider();

  const { toastContent } = useToastNotification();

  const ToastContainer = () => {
    return (
      <Container className={toastContent.title ? "active" : ""}>
        <Header>
          <SuccessfulIcon />
          {toastContent.title}
        </Header>
        <Description>{toastContent.description}</Description>
      </Container>
    );
  };

  return () => <ToastContainer />;
};

export default getToastContainer;
