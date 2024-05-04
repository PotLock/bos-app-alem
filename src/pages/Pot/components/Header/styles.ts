import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 64px 4rem 80px;
  .pool-table {
    max-width: 514px;
    width: 100%;
  }
  @media only screen and (max-width: 1068px) {
    flex-direction: column;
    .pool-table {
      margin: auto;
    }
  }
  @media only screen and (max-width: 768px) {
    padding: 3rem 0;

    .pool-table {
      max-width: 100%;
    }
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
`;

export const Title = styled.div`
  font-size: 40px;
  font-weight: 500;
  font-family: "Lora";
`;
export const Description = styled.div`
  max-width: 498px;
  line-height: 1.5em;
  a {
    color: #7b7b7b;
    font-weight: 600;
  }
`;

export const Fund = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  > div {
    display: flex;
    gap: 8px;
    align-items: baseline;
    div {
      font-weight: 600;
    }
  }
  .near-price {
    font-size: 24px;
  }
`;
export const ButtonsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  a,
  button {
    width: 180px;
  }
  @media only screen and (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
    a,
    button {
      width: 100%;
    }
  }
`;
export const Referral = styled.div`
  font-size: 14px;
  gap: 12px;
  display: flex;
  align-items: center;
`;
