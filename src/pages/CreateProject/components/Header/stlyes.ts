import styled from "styled-components";

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 40px;
  width: 100%;
  gap: 1.5rem;
  justify-content: center;
  border: 1px solid #f8d3b0;
  border-radius: 12px;
  overflow: hidden;
  text-align: center;
  @media (max-width: 768px) {
    padding: 48px 20px;
    text-align: left;
  }
`;

export const HeaderTitle = styled.div`
  font-size: 40px;
  font-family: "Lora";
  line-height: 120%;
  letter-spacing: -0.8px;
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

export const HeaderDescription = styled.div`
  font-size: 18px;
  line-height: 155%;
  max-width: 600px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;
