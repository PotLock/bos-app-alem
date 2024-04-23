import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Title = styled.div`
  font-weight: 600;
  font-size: 22px;
`;

export const PrviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 922px;
`;

export const AdminsWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  opacity: 0;
  pointer-events: none;
  padding-top: 5px;
  transition: all 300ms;
  top: 100%;
  .list {
    background: white;
    color: #292929;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0px 0px 1px 0px rgba(41, 41, 41, 0.74), 0px 3px 3px 0px rgba(123, 123, 123, 0.12),
      0px 6px 6px 0px rgba(123, 123, 123, 0.12);
    a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 12px 16px;
      color: #292929;
      transition: 300ms;
      .profile-image {
        width: 24px;
        height: 24px;
        box-shadow: 0px 0px 1px 0px #a6a6a6 inset;
        border: 2px solid #f8d3b0;
        border-radius: 50%;
      }
      &:hover {
        background: #292929;
        text-decoration: none;
        color: white;
      }
    }
  }
  .tip-icon {
    display: flex;
    justify-content: center;
    z-index: 1;
    svg {
      stroke: rgb(41 41 41 / 21%);
    }
  }
`;

export const Admins = styled.div`
  display: flex;
  font-size: 11px;
  gap: 2rem;
  .owner {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    .address {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      div {
        font-size: 14px;
        font-weight: 500;
      }
      .profile-image {
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }
    }
  }
  .admins {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    .avaters {
      display: flex;
      gap: 0.5rem;
    }
    .profile-image {
      width: 24px;
      height: 24px;
    }
    .icons-tolltip {
      position: relative;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      border-radius: 50%;
      border: 2px solid #f8d3b0;
      background: #b8182d;
      &:hover {
        ${AdminsWrapper} {
          opacity: 1;
          pointer-events: all;
        }
      }
    }
  }
  .edit {
    display: flex;
    gap: 0.5rem;
    color: #dd3345;
    align-items: center;
    cursor: pointer;
    margin-left: auto;
  }
  @media only screen and (max-width: 768px) {
    flex-wrap: wrap;
    .edit {
      width: 100%;
    }
  }
`;

export const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 12px;
  border: 1px solid #c7c7c7;
  padding: 3rem;
  margin-top: 1.5rem;
  .row-field {
    display: flex;
    align-items: center;
    gap: 2rem;
    font-size: 14px;
  }
  .label {
    font-weight: 500;
    max-width: 238px;
    width: 100%;
    text-align: left;
  }
  .input {
    color: #7b7b7b;
  }
  @media only screen and (max-width: 768px) {
    padding: 1rem;
    gap: 1.5rem;
    .row-field {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }
`;
