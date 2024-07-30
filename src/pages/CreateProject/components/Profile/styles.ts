import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
`;

export const BackgroundImage = styled.div`
  display: flex;
  position: relative;
  height: 280px;
  width: 100%;
  border-radius: 6px;
  background: var(--Neutral-200);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  span {
    font-weight: 500;
    font-size: 14px;
    line-height: 142%;
  }
  .btn-change-bg {
    z-index: 10;
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
    background: white;
    box-shadow: rgba(0, 0, 0, 0.22) 0px 0px 0px 1px inset, rgba(15, 15, 15, 0.15) 0px -1px 0px 0px inset,
      rgba(5, 5, 5, 0.08) 0px 1px 2px -0.5px;
    padding: 9px 16px;
    display: flex;
    gap: 8px;
    border-radius: 6px;
    transition: 200ms ease-in-out;
    width: fit-content;
    cursor: pointer;
    svg {
      width: 18px;
    }
  }
  @media screen and (max-width: 768px) {
    .btn-change-bg {
      width: 40px;
      height: 40px;
      padding: 0;
      border-radius: 50%;
      span {
        display: none;
      }
    }
  }
`;

export const ProfileImage = styled.div`
  position: relative;
  transform: translateY(-37%);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--Neutral-200);
  box-shadow: 0px 0px 0px 3px #fff, 0px 0px 0px 1px rgba(199, 199, 199, 0.22) inset;
  img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .btn-change-img {
    position: absolute;
    bottom: 0;
    right: 0;
    background: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.22) inset, 0px -1px 0px 0px rgba(15, 15, 15, 0.15) inset,
      0px 1px 2px -0.5px rgba(5, 5, 5, 0.08);
    svg {
      width: 20px;
    }
  }
`;
