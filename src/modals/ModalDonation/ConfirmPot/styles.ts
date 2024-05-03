import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem;
  gap: 1.5rem;
  @media only screen and (max-width: 480px) {
    padding: 1.5rem 1.125rem;
  }
`;

export const ContentScrollable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: scroll;
  height: 450px;
`;

export const Label = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;
export const Amout = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  span {
    font-weight: 600;
  }
  div {
    font-weight: 600;
    font-size: 1rem;
  }
  .usd-amount {
    color: #7b7b7b;
  }
  .toggle-icon {
    width: 8px;
    display: flex;
    margin-left: auto;
    overflow: hidden;
    svg {
      width: 100%;
      transition: all 300ms ease-in-out;
    }
  }
  img,
  svg {
    width: 20px;
  }
`;

export const SvgIcon = styled.svg`
  width: 16px;
`;

export const FeesRemoval = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .check {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .label {
    margin-right: 4px;
    margin-left: 8px;
  }
  .address {
    font-weight: 600;
    gap: 4px;
    display: flex;
    align-items: center;
    color: #292929;
    transition: all 300ms;
    &:hover {
      color: #dd3345;
      text-decoration: none;
    }
  }
  .profile-image {
    width: 17px;
    height: 17px;
    display: flex !important;
  }
  @media only screen and (max-width: 480px) {
    .address {
      margin-left: 34px;
      width: 100%;
    }
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 4rem;
  margin-bottom: 0.5rem;
  gap: 1rem;
  justify-content: flex-end;
  @media only screen and (max-width: 480px) {
    margin-top: 2rem;
  }
`;

export const Projects = styled.div`
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: 1px solid #ebebeb;
  background: rgba(235, 235, 235, 0.24);
  transition: all 300ms ease-in-out;
  &.hidden {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
  }
  .project {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1rem;
    transition: 300ms ease-in-out;
  }
  .profile-image {
    width: 40px;
    height: 40px;
    box-shadow: 0px 0px 1px 0px #a6a6a6 inset;
    border-radius: 50%;
  }
  .info {
    display: flex;
    flex-direction: column;
    .name {
      font-weight: 600;
    }
    .address {
      color: #7b7b7b;
      transition: all 300ms;
      &:hover {
        text-decoration: none;
        color: #dd3345;
      }
    }
  }
`;

export const ProjectAmount = styled.div`
  margin-left: auto;
  display: flex;
  gap: 1rem;
  align-items: center;
  div {
    font-weight: 600;
  }
  svg {
    width: 16px;
  }
`;
