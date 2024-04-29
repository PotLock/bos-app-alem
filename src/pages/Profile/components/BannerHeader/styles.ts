import styled from "styled-components";

export const Container = styled.div`
  padding-top: 0;
  position: relative;
`;

export const ProfileWraper = styled.div`
  display: flex;
  padding-left: 4rem;
  align-items: end;
  transform: translateY(-50%);
  position: relative;
  z-index: 6;
  @media screen and (max-width: 768px) {
    padding-left: 8px;
  }
`;

export const ProfileStats = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transform: translate(-25px, -20px);
  @media screen and (max-width: 768px) {
    transform: translate(-25px, 0px);
    gap: 10px;
  }
`;
export const Verified = styled.div`
  opacity: 1;
  display: flex;
  align-items: center;
  font-size: 11px;
  letter-spacing: 0.88px;
  gap: 4px;
  padding: 3px;
  border-radius: 20px;
  background: #fff;
  text-transform: uppercase;
  overflow: hidden;
  &.not-verified {
    width: 10px;
    opacity: 0;
  }
  div {
    font-weight: 600;
  }
  svg {
    background: white;
    border-radius: 50%;
  }
  @media screen and (max-width: 768px) {
    div {
      display: none;
    }
  }
`;

export const ProfileImageContainer = styled.div`
  background: white;
  border-radius: 50%;
  padding: 6px;
  position: relative;
  width: 120px;
  height: 120px;
  &.editable {
    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: rgba(45.9, 45.9, 45.9, 0);
      transition: background-color 0.3s;
      pointer-events: none;
      @media screen and (max-width: 768px) {
        height: 64px;
      }
    }
    &:hover {
      cursor: pointer;
      &:after {
        background-color: rgba(45.9, 45.9, 45.9, 0.4);
      }
      svg {
        opacity: 1;
      }
    }
  }
  .profile-image {
    height: 100%;
    width: 100%;
    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  > svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0; /* Start with the image invisible */
    transition: opacity 0.3s;
    z-index: 2; /* Ensure the image is on top */
    pointer-events: none;
  }
  @media screen and (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

export const BackgroundImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 318px;
  display: flex;
  &.editable {
    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(45.9, 45.9, 45.9, 0);
      transition: background-color 0.3s;
      pointer-events: none;
    }
    &:hover {
      cursor: pointer;

      &:after {
        background-color: rgba(45.9, 45.9, 45.9, 0.4);
      }

      svg {
        opacity: 1;
      }
    }
  }
  img {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 2;
    pointer-events: none;
  }
  @media screen and (max-width: 768px) {
    height: 264px;
  }
`;
