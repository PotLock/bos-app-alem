import styled from "styled-components";

export const Banner = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 0.5rem;
  overflow: hidden;
  background: var(--Primary-600);
  color: white;
  font-size: 22px;
  div {
    color: #3f130b;
    font-size: 20px;
    font-weight: 600;
    color: white;
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
    path {
      fill: white;
    }
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

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  gap: 24px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
