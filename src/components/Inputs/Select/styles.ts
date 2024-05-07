import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0px;
  gap: 0.45em;
  width: 100%;
  .switch-trigger {
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.22) inset;
    font-size: 14px;
    border: none;
  }
`;

export const Label = styled.label`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  word-wrap: break-word;
  color: #2e2e2e;
`;

export const Input = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.5em 0.75em;
  gap: 10px;
  background: #ffffff;
  border: 1px solid #d0d5dd;
  /* box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05); */
  box-shadow: 0px -2px 0px rgba(93, 93, 93, 0.24) inset;
  border-radius: 4px;
  color: #101828;
  width: 100%;
`;

export const Placeholder = styled.span`
  color: #a0a3a8;
`;

export const scaleOut = styled.keyframes`
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
`;

export const SelectContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0;
  gap: 0.5em;
  width: 100%;
  border: 1px solid #d0d5dd;
  border-radius: 4px;
  background: #ffffff;
  z-index: 3 !important;
`;

export const Viewport = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0;
  width: 100%;
`;

export const Item = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.5em 0.75em;
  gap: 0.5em;
  width: 100%;
  cursor: pointer;
  background: transparent;
  border: none;
  transition: background 0.2s ease-in-out;

  &:nth-child(n + 1) {
    border-top: 1px solid #d0d5dd;
  }

  &:hover {
    background: #d0d5dd;
    boder: none;
  }

  &:focus {
    outline: none;
  }
`;
