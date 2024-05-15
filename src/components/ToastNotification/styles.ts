import styled from "styled-components";

export const Container = styled.div`
  position: fixed;
  right: -310px;
  top: 10%;
  opacity: 0;
  display: flex;
  flex-direction: column;
  max-width: 300px;
  padding: 1rem;
  background: #fff;
  box-shadow: 0px 0px 0px 1px rgba(5, 5, 5, 0.08), 0px 8px 8px -4px rgba(15, 15, 15, 0.15),
    0px 4px 15px -2px rgba(5, 5, 5, 0.08);
  border-radius: 6px;
  gap: 6px;
  font-size: 14px;
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  &.active {
    right: 10px;
    opacity: 1;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  div {
    line-height: 142%;
    font-weight: 600;
  }
  svg {
    width: 18px;
    height: 18px;
  }
`;

export const Description = styled.div`
  padding-left: 1.5rem;
  color: #656565;
`;
