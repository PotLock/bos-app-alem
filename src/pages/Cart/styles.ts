import styled from "styled-components";

export const Container = styled.div`
  background: #fafafa;
  display: flex;
  flex-direction: row;
  height: 100%;
  min-height: 100vh;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 24px;
  gap: 24px;
`;

// const ButtonsContainer = styled.div`
//   display: flex;
//   flex-direction: row;
//   gap: 24px;
//   width: 50%;
//   align-items: center;
//   justify-content: center;
// `;

export const ColumnLeft = styled.div`
  display: flex;
  flex-direction: column;
  width: 55%;
  padding: 48px 40px 48px 64px;
  gap: 48px;

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 24px 16px 24px 16px;
  }
`;

export const ColumnRight = styled.div`
  flex: 1;
  padding: 152px 148px 152px 84px;
  border-left: 1px #c7c7c7 solid;

  @media screen and (max-width: 768px) {
    padding: 24px 16px 24px 16px;
    border-left: none;
    border-top: 1px #c7c7c7 solid;
  }
`;

export const Title = styled.div`
  color: #2e2e2e;
  font-size: 48px;
  font-family: Lora;
  font-weight: 500;
  line-height: 56px;
  word-wrap: break-word;
  text-align: center;
`;

export const Icon = styled.svg`
  width: 1rem;
  height: 1rem;
  path {
    transition: 300ms;
  }
`;

export const ActionsContainer = styled.div`
  width: 100%;
  padding: 16px;
  background: white;
  border: 1px solid #dbdbdb;
  box-shadow: 0px -2px 0px #dbdbdb inset;
  border-radius: 6px;
  overflow: hidden;
  justify-content: flex-start;
  align-items: center;
  display: inline-flex;
  gap: 24px;
`;

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  :hover path {
    fill: #dd3345;
  }
`;

export const SubTitle = styled.div`
  color: #2e2e2e;
  font-weight: 600;
  font-size: 14px;
`;

export const TxLink = styled.a`
  color: #2e2e2e;
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }
`;
