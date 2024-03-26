import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const SearchBarContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  width: 100%;
  background: #f0f0f0;
  padding: 12px 24px;
  @media only screen and (max-width: 480px) {
    padding: 12px 16px 12px 0px;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const SearchBarInput = styled.input`
  background: none;
  width: 100%;
  outline: none;
  border: none;
  color: #525252;
  &:focus {
    outline: none;
    border: none;
  }
`;

export const FilterButton = styled.div`
  white-space: nowrap;
  display: flex;
  cursor: pointer;
  gap: 12px;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #525252;
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
  top: 100%;
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
  @media screen and (max-width: 768px) {
    left: 0;
    background: #fff;
    width: 250px;
  }
`;

export const FilterItem = styled.div`
  cursor: pointer;
  padding: 8px;
  display: flex;
  gap: 12px;
  white-space: nowrap;
  &:hover {
    background: #dd3345;
    color: #fff;
    border-radius: 6px;
  }
`;

export const SearchIcon = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.div`
  color: #292929;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 1.12px;
  text-transform: uppercase;
`;
