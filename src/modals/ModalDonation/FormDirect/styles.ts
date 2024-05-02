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
export const CustomButton = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 4rem;
  margin-bottom: 0.5rem;
  gap: 1rem;
  @media only screen and (max-width: 480px) {
    margin-top: 2rem;
  }
`;
export const Button = styled.button`
  padding: 9px 12px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  transition: background 200ms ease;
  outline: none;
  border: none;
  width: fit-content;
  &.filled {
    background: #464646;
    color: white;
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.84) inset, 0px 1px 1px 1px rgba(166, 166, 166, 0.4) inset,
      0px 0px 0px 2px rgba(166, 166, 166, 0.4) inset, 0px 1px 2px 0px rgba(15, 15, 15, 0.15),
      0px 1px 3px -1px rgba(5, 5, 5, 0.08);
    &:hover {
      background: #525252;
    }
    &.disabled {
      color: #a6a6a6;
      background: var(--Neutral-100, #ebebeb);
      box-shadow: 0px 0px 0px 1px rgba(15, 15, 15, 0.15) inset;
    }
  }
  &.outline {
    background: #fff;
    color: #292929;
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.22) inset, 0px -1px 0px 0px rgba(15, 15, 15, 0.15) inset,
      0px 1px 2px -0.5px rgba(5, 5, 5, 0.08);
    &:hover {
      background: #f7f7f7;
    }
    &.disabled {
      color: #c7c7c7;
      background: var(--Neutral-White, #fff);
      box-shadow: 0px 0px 0px 1px rgba(15, 15, 15, 0.15) inset;
    }
  }
  &:focus {
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.84) inset, 0px 1px 1px 1px rgba(166, 166, 166, 0.3) inset,
      0px 0px 0px 2px rgba(166, 166, 166, 0.3) inset, 0px 0px 0px 2px #fff, 0px 0px 0px 4px rgba(0, 0, 0, 0.84);
  }
  &.disabled {
    pointer-events: none;
  }
`;
