import styled from "styled-components";

export const NoResults = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 1rem;
  border-radius: 12px;
  gap: 24px;
  background: #f6f5f3;
  .text {
    font-family: "Lora";
    font-size: 22px;
    font-style: italic;
    font-weight: 500;
    color: #292929;
  }
  img {
    width: 100%;
    max-width: 604px;
  }
  @media screen and (max-width: 768px) {
    padding: 1.5rem 1rem;
    .text {
      font-size: 16px;
    }
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Line = styled.div`
  width: 100%;
  background: #c7c7c7;
  height: 1px;
  margin: 3rem 0;
`;
