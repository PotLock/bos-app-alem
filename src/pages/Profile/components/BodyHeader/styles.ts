import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 4rem;
  margin-bottom: 66px;
  width: 100%;
  gap: 0.5rem;
  @media screen and (max-width: 768px) {
    padding: 0 1rem;
  }
`;

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 2rem;
  @media only screen and (max-width: 480px) {
    flex-direction: column;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
`;

export const NameContainer = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: end;
  gap: 1rem;
`;

export const Name = styled.div`
  font-size: 40px;
  font-weight: 500;
  color: #2e2e2e;
  line-height: 1;
  font-family: "Lora";

  @media screen and (max-width: 768px) {
    font-size: 32px;
    line-height: 40px;
  }
`;

export const AccountInfoContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const AccountId = styled.div`
  font-size: 16px;
  font-weight: 400;
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;
