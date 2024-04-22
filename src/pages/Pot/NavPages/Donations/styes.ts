import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  @media screen and (min-width: 375px) and (max-width: 768px) {
    width: 99%;
  }
  @media screen and (max-width: 390px) {
    width: 98%;
  }
`;

export const OuterTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  align-items: center;
  @media screen and (max-width: 768px) {
    padding-right: 10px;
  }
`;

export const OuterText = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

export const DonationsCount = styled.div`
  font-size: 16px;
`;

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 0.5px rgba(41, 41, 41, 0.5) solid;
  box-shadow: 0px 4px 12px -4px rgba(82, 82, 82, 0.2);
  border-radius: 2px;
  width: 100%;
  overflow-x: auto;
  flex-wrap: nowrap;
`;

export const Sort = styled.div`
  display: none;
  justify-content: space-between;
  width: 100%;
  margin-top: 1.5rem;
  div {
    display: flex;
    align-items: center;
    font-weight: 500;
    cursor: pointer;
    gap: 8px;
    color: #7b7b7b;
    &.active {
      color: #292929;
    }
    svg {
      transition: rotate 300ms;
    }
  }
  @media screen and (max-width: 768px) {
    display: flex;
  }
`;
