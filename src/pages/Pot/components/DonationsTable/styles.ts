import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 24px;
  padding-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid #7b7b7b;
  align-items: center;
  gap: 2rem;
  .transcation {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: 14px;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    gap: 2rem;
    color: #292929;
    border-bottom: 1px solid rgba(199, 199, 199, 0.5);
    div {
      width: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 600;
      &.sort {
        cursor: pointer;
        gap: 8px;
        svg {
          transition: rotate 300ms;
        }
      }
    }
    .price {
      width: 70px;
      margin-right: 5rem;
    }
  }
  .address {
    /* width: 143px !important; */
    flex: 1;
    justify-content: flex-start !important;
  }
  @media only screen and (max-width: 992px) {
    .header .price {
      margin-right: 0;
    }
  }
  @media only screen and (max-width: 768px) {
    .header {
      display: none;
    }
  }
`;

export const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  font-size: 14px;
  background: #f6f5f3;
  padding: 0.5rem 1rem;
  @media only screen and (max-width: 780px) {
    gap: 0.5rem;
  }
`;

export const SearchBar = styled.input`
  background: none;
  width: 100%;
  outline: none;
  border: none;
  &:focus {
    outline: none;
    border: none;
  }
`;

export const SearchIcon = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
`;

export const TrRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 2rem;
  padding: 1rem;
  border-top: 1px solid rgb(199 199 199 / 50%);
  > div {
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .price {
    display: flex;
    gap: 1rem;
    align-items: center;
    font-weight: 600;
    width: 74px;
    margin-right: 5rem;
    justify-content: flex-start;
    span {
      display: none;
    }
    img {
      width: 1.125rem;
    }
  }
  .address {
    position: relative;
    color: #292929;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: 2px;
    transition: all 200ms;
    font-weight: 600;
    .profile-image {
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 1rem;
    }
    :hover {
      text-decoration: none;
      .flag {
        opacity: 1;
        pointer-events: all;
      }
    }
  }
  .project-mobile-view {
    position: relative;
    width: fit-content;
    color: #7b7b7b;
    border-radius: 14px;
    padding: 4px 6px;
    border: 1px solid var(--Neutral-200, #dbdbdb);
    background: var(--Neutral-100, #ebebeb);
    cursor: pointer;
    display: none;
    align-items: center;
    gap: 0.5rem;
    margin-left: 4px;
    .profile-image {
      width: 1.125rem;
      height: 1.125rem;
      display: flex !important;
    }
    .flag {
      left: -50%;
      .tip-icon {
        padding-left: 50%;
      }
    }
    :hover {
      text-decoration: none;
      .flag {
        opacity: 1;
        pointer-events: all;
      }
    }
    @media only screen and (max-width: 768px) {
      display: flex;
    }
  }
  .date span {
    display: none;
  }
  @media only screen and (max-width: 992px) {
    .price {
      margin-right: 0;
    }
  }
  @media only screen and (max-width: 768px) {
    flex-wrap: wrap;
    .project {
      display: none !important;
    }
    .price {
      min-width: 120px;
      gap: 8px;
      width: fit-content;
      justify-content: flex-start;
      span {
        display: inline-block;
      }
    }
    .date {
      width: 100%;
      justify-content: start;
      gap: 4px;
      span {
        display: inline;
      }
    }
    .address .profile-image {
      margin-right: 0.5rem;
    }
  }
`;

export const Flag = styled.div`
  display: flex;
  align-content: center;
  gap: 12px;
  margin-left: auto;
  opacity: 0;
  pointer-events: none;
  font-weight: 500;
  transition: 300ms ease-in-out;
  @media only screen and (max-width: 992px) {
    opacity: 1;
    div {
      display: none;
    }
  }
  @media only screen and (max-width: 768px) {
    margin-left: 0.5rem;
  }
`;

export const FlagTooltipWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  opacity: 0;
  pointer-events: none;
  transition: all 300ms ease 0s;
  top: 100%;
  background: white;
  z-index: 1;
  box-shadow: 0px 0px 1px 0px rgba(41, 41, 41, 0.74), 0px 3px 3px 0px rgba(123, 123, 123, 0.12),
    0px 6px 6px 0px rgba(123, 123, 123, 0.12);
  border-radius: 4px;
  padding: 1rem;
  max-width: 550px;
  width: max-content;
  margin-top: 8px;
  cursor: default;
  .content {
    display: flex;
    gap: 1rem;
    .content-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .profile-image {
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 0;
    }
    .title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .role {
      font-weight: 600;
      color: #7b7b7b;
    }
    .dot {
      width: 5px;
      height: 5px;
      background: #7b7b7b;
      border-radius: 50%;
    }
    .admin {
      font-weight: 600;
      display: flex;
      gap: 4px;
    }
    .text {
      color: #7b7b7b;
    }
    .flaged {
      color: #ed464f;
      font-weight: 600;
      &:hover {
        text-decoration: none;
      }
    }
  }
  .tip-icon {
    display: flex;
    z-index: 1;
    position: absolute;
    top: 0;
    height: 8px;
    transform: translateY(-100%);
    width: 100%;
    justify-content: flex-start;
    left: 0;
    padding-left: 2.5rem;

    svg {
      stroke: rgb(41 41 41 / 21%);
    }
  }
  @media only screen and (max-width: 768px) {
    width: 300px;
    padding: 0.5rem;
    font-size: 12px;
    .content .profile-image {
      display: none !important;
    }
  }
`;
