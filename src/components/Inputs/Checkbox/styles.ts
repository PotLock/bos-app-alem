import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: row;
  align-items: center;
`;

export const CheckBoxContent = styled.input`
  width: 18px;
  height: 18px;
  padding: 0px;
  appearance: checkbox;
  cursor: pointer;
  /* TODO: update background color when selected */
`;

export const Label = styled.label``;

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
