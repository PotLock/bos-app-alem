import styled from "styled-components";

type Props = {
  children: JSX.Element | JSX.Element[];
  onOverlayClick?: (event: any) => void;
  contentStyle?: any;
  overlayStyle?: any;
};

const ModalOverlay = ({ children, onOverlayClick, contentStyle }: Props) => {
  const ModalOverlay = styled.div`
    position: fixed;
    padding: 0 10px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  const ModalContent = styled.div`
    width: 100%;
    max-width: 600px;
    padding: 24px 24px 18px 24px;
    background: white;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 0px 0px 1px rgba(41, 41, 41, 0.1), 0px 8px 12px -4px rgba(41, 41, 41, 0.1),
      0px 20px 32px -10px rgba(41, 41, 41, 0.1), 0px 32px 44px -16px rgba(41, 41, 41, 0.1);
  `;

  return (
    <ModalOverlay style={contentStyle} onClick={onOverlayClick}>
      <ModalContent style={contentStyle}>{children}</ModalContent>
    </ModalOverlay>
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
