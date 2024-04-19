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
