import styled from "styled-components";

export const HeaderContainer = styled.div`
  width: 100%;

  padding: 80px 64px;

  @media (max-width: 768px) {
    padding: 36px 24px;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HeaderTitle = styled.div`
  color: #2e2e2e;
  font-size: 88px;
  font-weight: 500;
  word-wrap: break-word;
  position: relative;
  text-align: center;
  z-index: 1;
  position: relative;
  font-family: "Lora";
  @media (max-width: 768px) {
    font-size: 48px;
  }
`;

export const HeaderDescription = styled.div`
  color: #2e2e2e;
  font-size: 32px;
  font-weight: 400;
  word-wrap: break-word;
  max-width: 866px;
  margin-top: 32px;

  @media (max-width: 768px) {
    font-size: 24px;
    text-align: center;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-top: 32px;
`;

export const Underline = styled.div`
  position: absolute;
  top: 44px;
  left: -40px;
  z-index: -1;

  @media (max-width: 768px) {
    top: 30px;
    left: -30px;
  }
`;
