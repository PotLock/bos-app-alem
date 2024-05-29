import styled from "styled-components";

export const FollowContainer = styled.div<{ buttonText?: string }>`
  button {
    position: relative;
    cursor: pointer;
    border-radius: 6px;
    border: 1px solid #dd3345;
    background: transparent;
    font-size: 14px;
    font-weight: 600;
    color: #dd3345;
    word-wrap: break-word;
    transition: all 300ms;
    &::before {
      background: #dd3345;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      content: "Unfollow";
      color: white;
      opacity: 0;
      transition: all 300ms;
    }
    :hover {
      background: #dd3345;
      color: white;
      ${(props) =>
        props.buttonText === "Following"
          ? `
      ::before {
        opacity: 1;
      }
    `
          : ""}
    }
  }
`;
