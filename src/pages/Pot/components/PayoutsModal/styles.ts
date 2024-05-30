import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
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
`;

export const PayoutItem = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  .id {
    width: 172px;
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
