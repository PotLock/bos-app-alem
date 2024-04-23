import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 20px;
  width: 380px;
  //   background: white;

  @media screen and (max-width: 768px) {
    width: 100%;
    margin-bottom: 50px;
  }
`;

export const Title = styled.div`
  color: #2e2e2e;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  word-wrap: break-word;
`;

export const CurrencyHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-radius: 5px;
  background: #f0f0f0;
`;

export const CurrencyHeaderText = styled.div`
  color: #7b7b7b;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  word-wrap: break-word;
`;

export const BreakdownItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
`;

export const BreakdownItemLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 50%;
  gap: 8px;
`;

export const BreakdownItemRight = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export const BreakdownItemText = styled.div`
  color: #2e2e2e;
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  word-wrap: break-word;
`;

export const CurrencyIcon = styled.img`
  width: 20px;
  height: 20px;
`;

export const TotalContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-top: 1px #7b7b7b solid;
`;

export const TotalText = styled.div`
  color: #2e2e2e;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  word-wrap: break-word;
`;

export const ErrorText = styled.div`
  color: #dd3345;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  word-wrap: break-word;
  width: 100%;
  text-align: center;
`;
