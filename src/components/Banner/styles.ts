import styled from "styled-components";

export const Wrapper = styled.div`
  height: 46px;
  width: 100%;
  margin-top: 1rem;
  @media screen and (max-width: 480px) {
    height: 72px;
  }
`;

export const Container = styled.div`
  position: fixed;
  z-index: 999;
  bottom: 0;
  left: 0;
  background: #faa7a8;
  width: 100%;
  height: 46px;
  color: white;
  overflow: hidden;
  font-size: 14px;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-blend-mode: overlay, normal;
    background: radial-gradient(circle, #fef3f2 0%, #feefe0 55.1%, #f8d3b0 100%);
  }
  .text {
    font-size: 14px;
    font-weight: 500;
    color: #192c07;
    line-height: 150%;
    display: flex;
    gap: 1rem;
    .link {
      display: flex;
      align-items: center;
      font-weight: 500;
      gap: 8px;
      color: #dd3345;
      text-decoration: none;
      svg {
        height: 15px;
        path {
          fill: #f6767a;
          transition: fill 300ms ease-in-out;
        }
      }
      :hover svg path {
        fill: #dd3345;
      }
    }
  }
  @media screen and (max-width: 480px) {
    height: 72px;
    .text {
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
  }
`;
