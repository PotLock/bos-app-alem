import styled from "styled-components";

export const Line = styled.div`
  width: 100%;
  height: 1px;
  background: #c7c7c7;
  margin: 3rem 0;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
export const Title = styled.div`
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: fit-content;
  cursor: pointer;
  margin-bottom: 1.5rem;
  div:first-of-type {
    font-weight: 600;
  }
  svg {
    rotate: 180deg;
    transition: all 300ms ease-in-out;
  }
`;
export const Table = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #7b7b7b;
  transition: max-height 400ms ease-in-out;
  overflow: hidden;
  max-height: 1000px;
  opacity: 1;
  &.hidden {
    opacity: 0;
    max-height: 0;
  }
`;

export const Flag = styled.div`
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #c7c7c7;
  font-size: 14px;
  &:last-of-type {
    border-bottom: none;
  }
  .profile-image {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
  }
  .content {
    display: flex;
    flex-direction: column;
  }
  .header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }
  .id {
    font-weight: 600;
    color: #292929;
    a {
      transition: 200ms;
      font-weight: 600;
      color: #292929;
      :hover {
        text-decoration: none;
        color: #dd3345;
      }
    }
  }
  .flagged-account {
    color: #ed464f;
    font-weight: 600;
    :hover {
      text-decoration: none;
    }
  }
  .role {
    color: #656565;
    font-weight: 600;
  }
  .reason {
    color: #656565;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    padding-left: 2.5rem;
    background: white;
  }
  .dot {
    background: #656565;
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }

  @media only screen and (max-width: 480px) {
    .profile-image {
      margin-right: 0;
    }
    .reason {
      padding-left: 2rem;
    }
  }
`;
