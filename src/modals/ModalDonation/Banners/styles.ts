import styled from "styled-components";

export const AlertBanner = styled.div`
  display: flex;
  padding: 0.75rem 1rem;
  color: #ed464f;
  gap: 1rem;
  align-items: center;
  border: 1px solid #f4b37d;
  border-radius: 6px;
  background: #fef6ee;
  margin-top: 1.5rem;
  div {
    font-weight: 500;
  }
  .icon {
    width: 22px;
  }
`;

export const NadabotBanner = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid #f4b37d;
  border-radius: 6px;
  background: #fef6ee;
  flex-wrap: wrap;
  margin-top: 1.5rem;
  .label {
    display: flex;
    align-items: center;
    font-weight: 500;
    gap: 1rem;
    img {
      width: 24px;
      height: 24px;
    }
  }
  .verify {
    color: #dd3345;
    font-weight: 500;
    margin-left: auto;
    &:hover {
      text-decoration: none;
    }
  }
  @media only screen and (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0px;
    .labe {
      align-items: flex-start;
    }
    .verify {
      margin-left: 40px;
    }
  }
`;

export const VerifyInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #ecc113;
  background: #fbf9c6;
  box-shadow: 0px 2px 1px 1px rgba(255, 255, 255, 0.8) inset, 0px -2px 4px 0px rgba(15, 15, 15, 0.15) inset;
  font-size: 14px;
  color: #3f2209;
  margin-top: 1.5rem;
  .icon {
    width: 17px;
    display: flex;
    height: fit-content;
    svg {
      width: 100%;
    }
  }
  .text {
    flex: 1;
    line-height: 150%;
  }
  a {
    font-weight: 500;
    color: #dd3345;
    :hover {
      text-decoration: none;
    }
  }
  @media only screen and (max-width: 480px) {
    flex-wrap: wrap;
    a {
      width: 100%;
      text-align: center;
    }
  }
`;
