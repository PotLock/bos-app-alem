import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  .transcation {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: 14px;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      gap: 1rem;
      background: #f6f5f3;
      color: #292929;
      div {
        width: 130px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
      }
    }
    .address {
      width: 190px !important;
      margin-right: auto;
      justify-content: start !important;
    }
    .rank {
      width: 80px !important;
    }
  }
  @media only screen and (max-width: 768px) {
    .transcation {
      font-size: 12px;
      .header {
        padding: 10px 0;
        div {
          width: 80px;
        }
      }
    }
  }
  @media only screen and (max-width: 480px) {
    .transcation {
      font-size: 9px;
      .address {
        width: 120px !important;
      }
    }
  }
`;

export const TrRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
  padding: 20px 10px;
  > div,
  > span {
    width: 130px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .price {
    display: flex;
    gap: 1rem;
    align-items: center;
    img {
      width: 1.5rem;
    }
  }
  .address {
    color: #292929;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: 2px;
    transition: all 200ms;
    .profile-image {
      width: 2rem;
      height: 2rem;
      margin-right: 1rem;
    }
  }
  @media only screen and (max-width: 768px) {
    padding: 10px 0;
    > div,
    > span {
      width: 80px;
    }
    .price {
      gap: 8px;
      img {
        width: 1.25rem;
      }
    }
    .address .profile-image {
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 0.5rem;
    }
  }
  @media only screen and (max-width: 480px) {
    .price img {
      width: 1rem;
    }
  }
`;

export const NoResult = styled.div`
  font-size: 2rem;
  text-align: center;
`;
