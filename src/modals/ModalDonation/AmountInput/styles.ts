import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  display: flex;
  border-radius: 6px;
  border: 1px solid #dbdbdb;
  border-bottom: 2px solid #dbdbdb;
  background: #fff;
  input {
    padding: 0.75rem 1rem;
    flex: 1;
    background: transparent;
    border: none;
    border-radius: 0;
    &:focus {
      box-shadow: none;
    }
  }
  .usd-amount {
    padding-right: 12px;
    color: #7b7b7b;
    display: flex;
    align-items: center;
    border-right: 1px solid #dbdbdb;
  }
`;

export const DropdownWrapper = styled.div`
  display: flex;
  span {
    font-weight: 500;
  }
`;

export const PotDenomination = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 1rem;
  .text {
    font-weight: 500;
  }
`;
