import styled from "styled-components";

export const Wrapper = styled.div`
  height: 48px;
  @media screen and (max-width: 768px) {
    height: 36px;
  }
`;

export const Container = styled.div`
  width: 100%;
  height: 48px;
  bottom: 0;
  left: 0;
  position: fixed;
  z-index: 999;
  background: #7fc41e;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  .text {
    font-size: 22px;
    font-weight: 500;
    letter-spacing: 0.015em;
    text-transform: uppercase;
    display: flex;
    gap: 1rem;
    .link {
      display: flex;
      align-items: center;
      font-weight: 600;
      gap: 4px;
      color: white;
      text-decoration: underline;
      transition: transform 300ms ease-in-out;
      img {
        transition: rotate 300ms ease-in-out;
        height: 1em;
        width: fit-content;
      }
      :hover {
        transform: translateX(4px);
        img {
          rotate: 45deg;
        }
      }
    }
  }
  @media screen and (max-width: 992px) {
    .text {
      font-size: 1rem;
    }
  }
  @media screen and (max-width: 768px) {
    height: 36px;
    .text {
      font-size: 12px;
      gap: 0.5rem;
    }
  }
`;
