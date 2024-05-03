import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: #fff;
  font-size: 14px;
  box-shadow: 0px 0px 0px 1px rgba(41, 41, 41, 0.1), 0px 8px 12px -4px rgba(41, 41, 41, 0.1),
    0px 20px 32px -10px rgba(41, 41, 41, 0.1), 0px 32px 44px -16px rgba(41, 41, 41, 0.1);
  overflow: hidden;
  border-radius: 6px;
  @media only screen and (max-width: 480px) {
    top: 0;
    border-radius: 0;
    position: fixed;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
    display: flex;
    z-index: 1000;
  }
`;

export const Banner = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem;
  gap: 0.5rem;
  overflow: hidden;
  background: #f8d3b0;
  color: white;
  font-size: 22px;
  div {
    color: #3f130b;
    font-size: 20px;
    font-weight: 600;
  }
  .left-pattern {
    position: absolute;
    left: 0;
    top: 0;
    width: 30%;
    transform: translate(-10%, -10%) scaleX(-1);
    pointer-events: none;
  }
  .right-pattern {
    position: absolute;
    right: 0;
    top: 0;
    width: 30%;
    transform: translate(10%, -10%);
    pointer-events: none;
  }
  @media only screen and (max-width: 480px) {
    padding: 1.125rem;
  }
`;

export const HeaderIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  svg {
    width: 14px;
    cursor: pointer;
    transition: all 300ms ease-in-out;
    path {
      fill: #3f130b;
    }
  }
  .close-icon {
    margin-left: auto;
    &:hover {
      rotate: 90deg;
    }
  }
  div {
    cursor: pointer;
    display: flex;
  }
  .back-arrow:hover svg {
    transform: translateX(-10px);
  }
`;
