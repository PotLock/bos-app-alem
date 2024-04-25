import styled from "styled-components";

export const Row = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  flex: 1;
  border-radius: 6px;
  border: 1px solid #7b7b7b;
  padding: 0.5rem;
  padding-left: 2.5rem;
  font-size: 14px;
`;

export const SearchIcon = styled.div`
  display: flex;
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  pointer-events: none;
  svg {
    height: 100%;
  }
`;

export const SearchBarInput = styled.input`
  background: none;
  width: 100%;
  outline: none;
  border: none;
  &:focus {
    outline: none;
    border: none;
  }
`;

export const FilterButton = styled.div`
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  width: fit-content;
  padding: 0.54rem 1rem;
  border-radius: 6px;
  border: 1px solid #7b7b7b;
  transition: all 200ms ease-in-out;
  &.active {
    color: #fff;
    background: #292929;
  }
`;

export const FilterIcon = styled.div`
  display: flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
`;

export const FilterMenu = styled.div`
  position: absolute;
  background: #fff;
  font-size: 14px;
  top: 110%;
  right: 0;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 6px;
  border: 1px solid rgba(41, 41, 41, 0.36);
  box-shadow: 0px 12px 20px -4px rgba(123, 123, 123, 0.32), 0px 4px 8px -3px rgba(123, 123, 123, 0.2),
    0px 0px 2px 0px rgba(123, 123, 123, 0.36);
  z-index: 2;
  opacity: 0;
  visibility: hidden;
  transform: translateY(100px);
  transition: all 200ms ease-in-out;
  &.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  @media screen and (max-width: 768px) {
    left: 0;
    background: #fff;
  }
`;

export const FilterItem = styled.div`
  cursor: pointer;
  padding: 8px;
  display: flex;
  gap: 12px;
  white-space: nowrap;
  &:hover {
    background: #292929;
    color: #fff;
    border-radius: 6px;
  }
`;
