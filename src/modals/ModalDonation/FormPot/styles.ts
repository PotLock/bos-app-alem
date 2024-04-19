import styled from "styled-components";

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
`;
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 2rem;
  @media only screen and (max-width: 480px) {
    padding: 0 1.125rem;
  }
`;
export const Label = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
`;

export const CurrentBalance = styled.div`
  display: flex;
  margin-top: 0.5rem;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
  .amount-alert {
    color: #e54141;
  }
  .balance {
    display: flex;
    gap: 0.5rem;
    div:last-of-type {
      color: #7b7b7b;
    }
  }
`;

export const TotalAmount = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-left: auto;
  .label {
    color: #7b7b7b;
  }
  .amount {
    font-weight: 600;
    .usd {
      color: #7b7b7b;
    }
  }
  @media only screen and (max-width: 480px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const Projects = styled.div`
  padding: 8px 0;
  border-top: 1px solid #ebebeb;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 238px;
  overflow-y: scroll;
  .project {
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    padding: 0.5rem 2rem;
    transition: 300ms ease-in-out;
    &:hover,
    &.selected {
      background: rgba(235, 235, 235, 0.24);
      .check {
        border-color: #dd3345;
        svg {
          display: block;
        }
      }
    }
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
  .check {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: 2px solid #c7c7c7;
    border-radius: 50%;
    svg {
      display: none;
      width: 12px;
    }
    &.selected {
      border-color: #dd3345;
      svg {
        display: block;
      }
    }
  }
  @media only screen and (max-width: 480px) {
    .project {
      padding: 0.5rem 1.125rem;
    }
  }
`;

export const ProjectAmount = styled.div`
  margin-left: auto;
  position: relative;
  display: flex;
  border-radius: 6px;
  background: rgb(246, 245, 243);
  box-shadow: rgb(255, 255, 255) 0px 1px 0px 0px, rgba(41, 41, 41, 0.1) 0px 0px 4px 0px,
    rgba(41, 41, 41, 0.1) 0px 2px 4px -1px inset, rgba(41, 41, 41, 0.1) 0px 8px 16px -4px inset;
  input {
    padding: 10px 16px;
    padding-right: 46px;
    text-align: right;
    width: 120px;
    background: transparent;
    border: none;
  }
  svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 1rem;
    width: 16px;
  }
`;

export const CustomButton = styled.div`
  display: flex;
  margin-top: 4rem;
  margin-bottom: 0.5rem;
  padding: 0 2rem;
  button {
    padding: 12px 16px;
    width: 100%;
    font-weight: 500;
  }
  @media only screen and (max-width: 480px) {
    margin-top: 2rem;
  }
`;
