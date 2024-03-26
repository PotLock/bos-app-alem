import styled from "styled-components";

export const Container = styled.div`
  max-width: 920px;
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

export const Header = styled.div`
  color: #2e2e2e;
  font-size: 40px;
  font-weight: 500;
  font-family: "Lora";
  @media screen and (max-width: 768px) {
    font-size: 32px;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 24px;
`;

export const GithubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  a {
    transition: all 300ms;
    display: flex;
    align-items: center;
    gap: 1rem;
    svg {
      transition: all 300ms;
    }
    .url {
      color: #292929;
      width: fit-content;
    }
    :hover {
      text-decoration: none;
      transform: translateX(4px);
      svg {
        rotate: 45deg;
      }
    }
  }
`;

export const SmartContractWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .contract {
    display: flex;
    align-items: center;
    gap: 1rem;
    .text {
      display: flex;
      flex-direction: column;
      .chain {
        font-size: 14px;
        color: #7b7b7b;
      }
    }
  }
`;
