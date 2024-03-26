import styled from "styled-components";

export const Container = styled.div``;

export const ProfileWraper = styled.div`
  display: flex;
  padding-left: 4rem;
  align-items: end;
  transform: translateY(-50%);
  position: relative;
  z-index: 6;
  @media screen and (max-width: 768px) {
    padding-left: 1rem;
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

export const ProfileImageContainer = styled.div`
  width: ${props.imageStyle?.width ?? "128px"};
  height: ${props.imageStyle?.height ?? "128px"};
  background: white;
  border-radius: 50%;
  padding: 6px;
  position: relative;
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
    opacity: 0; // Start with the image invisible
    transition: opacity 0.3s;
    z-index: 2; // Ensure the image is on top
    pointer-events: none;
  }

  ${editable &&
  `
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width:100%;
    border-radius: 50%;
    background-color: rgba(45.9, 45.9, 45.9, 0); // Start with transparent overlay
    transition: background-color 0.3s; // Smooth transition for the overlay
    pointer-events: none;

    @media screen and (max-width: 768px) {
      height: 64px;
    }

  }

  &:hover {
    cursor: pointer;

    &:after {
      background-color: rgba(45.9, 45.9, 45.9, 0.4); // Dark overlay with 40% opacity on hover
    }

    svg {
      opacity: 1; // Make the image visible on hover
    }
  }
  `}
  @media screen and (max-width: 768px) {
    width: 72px;
    height: 72px;
  }
`;

export const BackgroundImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 318px;
  img {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
  @media screen and (max-width: 768px) {
    height: 264px;
  }
  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0; // Start with the image invisible
    transition: opacity 0.3s;
    z-index: 2; // Ensure the image is on top
    pointer-events: none;
  }

  ${editable &&
  `
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: ${backgroundStyle.height ?? "100%"};
    background-color: rgba(45.9, 45.9, 45.9, 0); // Start with transparent overlay
    transition: background-color 0.3s; // Smooth transition for the overlay
    pointer-events: none;
  }

  &:hover {
    cursor: pointer;

    &:after {
      background-color: rgba(45.9, 45.9, 45.9, 0.4); // Dark overlay with 40% opacity on hover
    }

    svg {
      opacity: 1; // Make the image visible on hover
    }
  }
  `}
`;
