import { useEffect } from "alem";
import SuccessfulIcon from "@app/assets/svgs/SuccessfulIcon";
import ToastProvider, { ToastProps } from "@app/contexts/ToastProvider";
import { useToastNotification } from "@app/hooks/useToast";
import { Container, Description, Header } from "./styles";

const ToastContainer = ({ toastContent }: { toastContent: ToastProps }) => {
  // ToastProvider();

  // const { toastContent } = useToastNotification();

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

export default ToastContainer;
