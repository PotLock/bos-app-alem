import styled from "styled-components";

export const Container = styled.div`
  padding: 16px 32px 40px;
  svg {
    display: block;
    cursor: pointer;
    width: 14px;
    transition: all 300ms ease-in-out;
    margin: 5px 0;
    margin-left: auto;
    &:hover {
      rotate: 90deg;
    }
  }
  .title {
    margin-bottom: 1rem;
    font-size: 16px;
    color: #7b7b7b;
    font-weight: 600;
    span {
      font-weight: 600;
      color: #292929;
    }
  }
  .reason {
    font-size: 14px;
    color: #7b7b7b;
  }
`;
