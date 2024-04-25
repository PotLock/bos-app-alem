import styled from "styled-components";

export const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px 0px;
  width: 100%;

  @media screen and (max-width: 880px) {
    padding: 10px 10px;
  }
`;

export const FormDivider = styled.div`
  height: 2px;
  width: 100%;
  background-color: #ebebeb;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const FormSectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 48px 0;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 32px;
  }
`;

export const FormSectionLeftDiv = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

export const FormSectionRightDiv = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 26px;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

export const FormSectionTitle = styled.div`
  color: #2e2e2e;
  font-size: 16;
  font-weight: 600;
  word-wrap: break-word;
`;

export const FormSectionDescription = styled.div`
  color: #2e2e2e;
  font-size: 16;
  font-weight: 400;
  word-wrap: break-word;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: end;
  justify-content: flex-start;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  @media screen and (max-width: 768px) {
    flex-direction: row;
  }
`;

export const Label = styled.label`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  word-wrap: break-word;
  color: #2e2e2e;
`;
