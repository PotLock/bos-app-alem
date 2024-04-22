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
`;

export const Banner = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem;
  gap: 0.5rem;
  overflow: hidden;
  background: #dd3345;
  color: white;
  font-size: 22px;
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
`;
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem;
  gap: 1.5rem;
  @media only screen and (max-width: 480px) {
    padding: 1.125rem;
  }
`;

export const Label = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

export const Limit = styled.div`
  color: #7b7b7b;
  text-align: right;
`;
export const InfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #ebebeb;
  background: #f6f5f3;
`;

export const ButtonsWrapper = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(2, 1fr);
  button {
    font-weight: 500;
  }
  .cancel {
    border: none;
    background: none;
    color: #dd3345;
  }
`;
