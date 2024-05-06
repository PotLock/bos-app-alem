import styled from "styled-components";

export const FormSectionLeftDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  /* background-color: yellow; */
  gap: 16px;
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
export const FormSectionIsRequired = styled.div`
  font-size: 16px;
  font-weight: 400;
  word-wrap: break-word;
  position: relative;
`;
export const SvgContainer = styled.div`
  position: absolute;
  top: -6;
  left: -26;
`;
