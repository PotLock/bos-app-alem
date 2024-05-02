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
  background: linear-gradient(0deg, rgba(252, 207, 207, 0.6) 0%, rgba(252, 207, 207, 0.6) 100%),
    radial-gradient(
      545.83% 50.85% at 50.66% 50%,
      rgba(254, 230, 229, 0.71) 0%,
      rgba(252, 233, 213, 0.78) 55.1%,
      rgba(244, 179, 125, 0.48) 98%
    );
  background-blend-mode: overlay, normal;
  width: 100%;
  height: 46px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-size: 14px;
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
