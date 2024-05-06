import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: row;
  align-items: center;
`;

export const CheckBoxContent = styled.div`
  width: 18px;
  height: 18px;
  border: 1px solid #c7c7c7;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 300ms ease-in-out;
  svg {
    width: 10px;
    opacity: 0;
    transition: all 300ms ease-in-out;
    path {
      fill: #ebebeb;
    }
  }
  &:hover svg,
  &.active svg,
  &.disabled svg {
    opacity: 1;
  }
  &.active {
    border-color: #dd3345;
    background: #dd3345;
    svg path {
      fill: #fff;
    }
  }
  &.disabled {
    border-color: #c7c7c7;
    pointer-events: none;
    svg path {
      fill: #c7c7c7;
    }
  }
`;

export const Label = styled.label`
  font-size: 14px;
  &.disabled {
    color: #a6a6a6;
  }
`;

export const Error = styled.span`
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  font-size: 0.75em;
  line-height: 1.25em;
  color: #ff4d4f;
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease-in-out;

  &.show {
    height: 1.25em;
  }
`;
