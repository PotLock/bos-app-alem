import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 72px 64px 72px 64px;

  @media screen and (max-width: 768px) {
    padding: 0px;
  }
`;

export const LowerBannerContainer = styled.div`
  position: absolute;
  top: 340px;
  left: 0px;
  display: flex;
  align-items: stretch; /* Ensuring child elements stretch to full height */
  justify-content: space-between;
  width: 100%;
  z-index: 10;
  @media screen and (max-width: 768px) {
    top: 310px;
    position: initial;
    align-items: flex-start;
    gap: 10px;
    flex-direction: column;
  }
`;

export const LowerBannerContainerLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-left: 190px;
  @media screen and (max-width: 768px) {
    margin-left: 0px;
  }
`;

export const LowerBannerContainerRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end; /* Pushes TeamContainer to the bottom */
  flex: 1;
`;

export const AddTeamMembers = styled.a`
  margin: 0px 0px 16px 36px;
  cursor: pointer;
  color: #dd3345;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    text-decoration: none;
  }
  @media screen and (max-width: 768px) {
    margin-bottom: 0;
  }
`;

export const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 68px 32px 68px;
  width: 100%;

  @media screen and (max-width: 768px) {
    padding: 0px 32px 32px 32px;
  }
`;

export const FormDivider = styled.div`
  height: 2px;
  width: 100%;
  background-color: #ebebeb;
`;

export const FormSectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 160px;
  margin: 48px 0 48px 0;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 32px;
  }
`;

export const FormSectionLeftDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  /* background-color: yellow; */
  gap: 16px;
`;

export const FormSectionRightDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  /* background-color: lightblue; */
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

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-top: 32px;
`;

export const Space = styled.div``;

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
  box-shadow: 0px -2px 0px rgba(93, 93, 93, 0.24) inset;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: flex-start;
  justify-content: center;
`;

export const Icon = styled.svg`
  width: 20px;
  height: 20px;
  cursor: pointer;
  path {
    transition: 300ms;
  }
  :hover path {
    fill: #dd3345;
  }
`;

export const FundingHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #f6f5f3;
  width: 100%;
`;

export const FundingHeaderItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: space-between;
  justify-content: flex-start;
  padding: 10px 20px;
`;

export const FundingHeaderItemText = styled.div`
  color: #292929;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  word-wrap: break-word;
`;

export const Table = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  border: 1px solid #7b7b7b;
  background: #fff;
  .header,
  .fudning-row {
    display: flex;
    justify-content: space-between;
  }
  .header {
    border-bottom: 0.5px solid #7b7b7b;
  }
  .fudning-row:not(:last-of-type) {
    border-bottom: 0.5px solid #7b7b7b;
  }
  .item {
    width: 140px;
    display: flex;
    align-items: center;
    &:nth-of-type(1) {
      width: 190px;
    }
    &:nth-of-type(2) {
      flex: 1;
    }
  }
  .source {
    width: 190px;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    div {
      font-weight: 600;
    }
    div:last-of-type {
      color: #7b7b7b;
      font-weight: 400;
    }
  }
  .amount {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    div:last-child {
      font-weight: 600;
    }
  }
  .btns {
    width: 95px;
    gap: 2rem;
    justify-content: space-between;
    svg {
      cursor: pointer;
      path {
        transition: 300ms ease-in-out;
      }
      &:hover {
        path {
          fill: black;
        }
      }
    }
  }
  .header .item {
    padding: 10px 1rem;
    color: #7b7b7b;
    font-weight: 600;
  }
  .fudning-row .item {
    padding: 1rem 1rem;
  }
  @media only screen and (max-width: 769px) {
    .header {
      display: none;
    }
    .fudning-row {
      flex-direction: column;
    }
    .item {
      width: 100%;
      justify-content: flex-start;
    }
  }
`;
