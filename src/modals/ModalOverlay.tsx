import styled from "styled-components";

type Props = {
  children: JSX.Element | JSX.Element[];
  onOverlayClick?: (event: any) => void;
  contentStyle?: React.CSSProperties;
  overlayStyle?: React.CSSProperties;
};

const ModalOverlay = ({ children, onOverlayClick, contentStyle }: Props) => {
  const overlayShow = styled.keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `;
  const contentShow = styled.keyframes`
    from {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  `;

  const Modal = styled.div`
    .AlertDialogOverlay {
      background: rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(4px);
      position: fixed;
      z-index: 999;
      inset: 0;
      /* animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1); */
    }
    .AlertDialogContent {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0px 0px 0px 1px rgba(55, 55, 55, 0.04), 0px 24px 32px -12px rgba(15, 15, 15, 0.15),
        0px 8px 40px -4px rgba(5, 5, 5, 0.08);
      position: fixed;
      z-index: 1000;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      max-width: 600px;
      max-height: 85vh;
      /* animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1); */
      padding: 24px 24px 18px 24px;
    }
    .AlertDialogContent:focus {
      outline: none;
    }
    @media only screen and (max-width: 768px) {
      .AlertDialogContent {
        width: 100vw;
        height: 100vh;
        top: 0px;
        transform: none;
        left: 0;
        max-width: 100%;
        max-height: 100%;
      }
    }
  `;

  return (
    <Modal>
      <AlertDialog.Root open>
        <AlertDialog.Overlay onClick={onOverlayClick} className="AlertDialogOverlay" />
        <AlertDialog.Content className="AlertDialogContent" style={contentStyle}>
          {children}
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Modal>
  );
};

// Propriedades sendo passadas para o Modal:
// getRandomProject(), -> projectId

// Then the fetch is being done inside the Main -> linha 287 -> isso esta fazendo o fetch de informacoes;
// PotId, se nao passar, chama ele novamente.

// Form: é para apenas um projeto
// FormPot: é o display que pode ser usado para doar para varios projetos

// ConfirmDirect: only one
// CorfirmPot: is for multiple

export default ModalOverlay;
