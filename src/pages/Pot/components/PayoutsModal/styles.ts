import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow-x: scroll;
  height: 80vh;
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: 500;
  overflow-wrap: break-word;
`;

export const PayoutsView = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  max-height: 100%;
  overflow-y: scroll;
  font-size: 12px;
`;

export const PayoutItem = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  > div {
    width: 140px;
  }
`;

export const Total = styled.div`
  display: flex;
  gap: 0.5rem;
  .original {
    color: #656565;
  }
  span {
    font-weight: 500;
    color: var(--Primary-600);
  }
`;
export const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

export const ExitIcon = styled.div`
  display: flex;
  justify-content: flex-end;
  svg {
    cursor: pointer;
    width: 18px;
  }
`;
export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 1rem;
  font-display: 500;
  > div {
    width: 140px;
    display: flex;
    align-items: center;
  }
  > div:not(:first-of-type) {
    justify-content: center;
    text-align: center;
  }
`;
