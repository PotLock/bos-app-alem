import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 2rem;
`;

export const Label = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;
export const Amout = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  img,
  svg {
    width: 20px;
  }
`;

export const SvgIcon = styled.svg`
  width: 16px;
`;

export const NoteWrapper = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 8px;
  svg {
    width: 14px;
  }
  div {
    font-weight: 500;
  }
`;

export const FeesRemoval = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .check {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
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
  margin-top: 2rem;
  margin-bottom: 0.5rem;
  button {
    padding: 12px 16px;
    width: 100%;
    font-weight: 500;
  }
`;
