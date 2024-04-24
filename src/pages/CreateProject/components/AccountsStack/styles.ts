import styled from "styled-components";

export const StackContainer = styled.div`
  width: 200px;
  height: 30px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 768px) {
    margin-left: 36px;
  }
`;

export const MoreAccountsContainer = styled.div`
  width: 28px;
  height: 28px;
  border: 2px solid white;
  border-radius: 50%;
  background: #dd3345;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: -8px;
`;

export const MoreAccountsText = styled.div`
  color: white;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
`;
