import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: flex-end;
  font-size: 14px;
`;

export const Label = styled.div`
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  width: fit-content;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #7b7b7b;
  svg {
    width: 18px;
  }
  &.active {
    color: #fff;
    background: #292929;
  }
`;

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  transition: all 300ms ease-in-out;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  border-radius: 8px;
  padding: 1rem;
  background: #fff;
  width: 500px;
  box-shadow: 0px 0px 0px 1px rgba(123, 123, 123, 0.09), 0px 3px 3px -1px rgba(123, 123, 123, 0.16),
    0px 9px 9px -3px rgba(123, 123, 123, 0.1), 0px 17px 14px -5px rgba(123, 123, 123, 0.08);
  opacity: 0;
  visibility: hidden;
  transform: translateY(100px);
  z-index: 1;
  &.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  .title {
    width: 100%;
    &:not(:first-of-type) {
      margin-top: 2rem;
    }
  }
  .option {
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 8px;
    border: 1px solid #dbdbdb;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 300ms ease-in-out;
    svg {
      display: none;
      width: 14px;
    }
    :hover {
      border: 1px solid #f4b37d;
      background: #fef6ee;
      color: #ea6a25;
    }
    &.selected {
      border: 1px solid #f4b37d;
      background: #fef6ee;
      color: #ea6a25;
      svg {
        display: block;
      }
    }
  }
  @media only screen and (max-width: 768px) {
    width: 200px !important;
    left: 0;
    right: auto;
  }
`;

export const Count = styled.div`
  font-weight: 600;
  font-size: 12px;
  display: flex;
  line-height: 1;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ebebeb;
  &.active {
    background: #464646;
    color: #f6f5f3;
  }
`;

export const Screen = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;
