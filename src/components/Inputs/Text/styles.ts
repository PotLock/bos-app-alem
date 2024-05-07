import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0px;
  gap: 0.45em;
  width: 100%;
  font-size: 14px;
`;

export const Label = styled.label`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  word-wrap: break-word;
  color: #2e2e2e;
`;

export const Error = styled.span`
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  font-size: 0.75em;
  line-height: 1.25em;
  color: #ff4d4f;
  overflow: hidden;
  transition: height 0.3s ease-in-out;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.22) inset;
  border-radius: 4px;
`;

export const InputPrefix = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  padding: 14px 16px;
  border-right: 1px #f0f0f0 solid;
  color: #7b7b7b;
  font-size: 16px;
  font-weight: 400;
`;

export const Input = styled.input`
  border: none;
  background: transparent;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5em 0.75em;
  gap: 0.5em;
  color: #101828;
  width: 100%;
  border-radius: 4px;
`;

export const PercentageSign = styled.span`
  display: flex;
  align-items: center;
  padding: 0 0.75em;
  color: #7b7b7b;
  font-size: 16px;
  font-weight: 400;
`;
