import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  > div {
    padding-top: 0rem;
  }
  @media screen and (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const NoResults = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 68px 105px;
  border-radius: 12px;
  background: #f6f5f3;
  .text {
    font-family: "Lora";
    max-width: 290px;
    font-size: 22px;
    font-style: italic;
    font-weight: 500;
    color: #292929;
  }
  img {
    width: 60%;
  }
  @media screen and (max-width: 768px) {
    flex-direction: column-reverse;
    padding: 24px 16px;
    .text {
      font-size: 16px;
    }
    img {
      width: 100%;
    }
  }
`;
