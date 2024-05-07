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
