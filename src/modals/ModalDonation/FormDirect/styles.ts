import styled from "styled-components";

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem;
  @media only screen and (max-width: 480px) {
    padding: 1.5rem 1.125rem;
  }
`;

export const Label = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
`;

export const CurrentBalance = styled.div`
  display: flex;
  margin-top: 0.5rem;
  gap: 0.5rem;
  justify-content: flex-end;
  .amount-alert {
    color: #e54141;
  }
  .balance {
    display: flex;
    gap: 0.5rem;
    div:last-of-type {
      color: #7b7b7b;
    }
  }
`;

export const PotWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
`;

export const PotSelector = styled.div`
  display: flex;
  > div:last-of-type {
    width: 100%;
  }
`;

export const Pot = styled.div`
  border-radius: 6px;
  border: 1px solid #dbdbdb;
  border-bottom-width: 2px;
  background: #fff;
  padding: 0.75rem 1rem;
`;
export const DirectButton = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 4rem;
  margin-bottom: 0.5rem;
  gap: 1rem;
  @media only screen and (max-width: 480px) {
    margin-top: 2rem;
  }
`;
