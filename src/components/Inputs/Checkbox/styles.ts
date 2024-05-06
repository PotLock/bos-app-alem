import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: row;
  align-items: center;
`;

export const CheckBoxContent = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #d9d9d9;
  display: flex;
  border-radius: 50%;
  cursor: pointer;
  div {
    width: 10px;
    height: 10px;
    background: transparent;
    border-radius: 50%;
    margin: auto;
  }
  &.active {
    border-color: #dd3345;
    div {
      background: #dd3345;
    }
  }
  &.disabled {
    border-color: #a6a6a6;
    pointer-events: none;
    div {
      background: #a6a6a6;
    }
  }
`;

export const Label = styled.label`
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
