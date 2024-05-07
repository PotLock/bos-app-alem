import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 4rem 0px;
  max-width: 816px;
  margin: auto;
  @media screen and (max-width: 768px) {
    padding: 3rem 0px;
  }
`;

export const LowerBannerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const LowerBannerContainerLeft = styled.div`
  display: flex;
`;

export const LowerBannerContainerRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end; /* Pushes TeamContainer to the bottom */
  flex: 1;
`;

export const AddTeamMembers = styled.a`
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
  align-items: flex-start;
  gap: 4rem;
`;

export const SubTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  gap: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  span {
    font-size: 14px;
    line-height: 140%;
  }
  .optional {
    color: #656565;
  }
  .required {
    color: #db521b;
    font-weight: 500;
  }
  @media only screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

export const DAOselect = styled.div`
  display: flex;
  justify-content: space-between;
  div {
    font-weight: 500;
  }
`;

export const FormDivider = styled.div`
  height: 2px;
  width: 100%;
  background-color: #ebebeb;
`;

export const BtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
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

export const FormSectionRightDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  /* background-color: lightblue; */
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
  color: var(--Neutral-600);
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.22) inset;
  border-radius: 4px 0px 0px 4px;
  font-size: 14px;
  background: var(--Neutral-50);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  .rbt {
    width: 100%;
    > div {
      border: 1px solid rgb(208, 213, 221);
      padding: 0.5em 0.75em;
      box-shadow: rgba(16, 24, 40, 0.05) 0px 1px 2px;
    }
  }
  @media only screen and (max-width: 768px) {
    grid-template-columns: 100%;
  }
`;

export const ContractRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  align-items: flex-start;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    > div {
      max-width: 100% !important;
    }
  }
`;

export const RepoLink = styled.div`
  display: flex;
  .github-url {
    color: var(--Neutral-600);
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.22) inset;
    font-size: 14px;
    background: var(--Neutral-50);
    border-radius: 6px 0px 0px 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
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
  border: 1px solid var(--Neutral-100);
  font-size: 14px;
  .header,
  .fudning-row {
    display: flex;
    justify-content: space-between;
  }
  .header {
    background: var(--Neutral-50);
    color: var(--Neutral-600);
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
    color: var(--Neutral-600);
    font-weight: 500;
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
