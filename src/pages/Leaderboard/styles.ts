import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  .leaderboard {
    width: 100%;
    h1 {
      font-size: 2.5rem;
      font-weight: 600;
      margin-top: 20px;
    }
    .cards {
      display: flex;
      gap: 3rem;
      margin-top: 2rem;
      margin-bottom: 5rem;
      > div {
        width: 30%;
        display: flex;
      }
      .top {
        width: 40%;
        scale: 1.05;
      }
      @media only screen and (max-width: 670px) {
        flex-direction: column;
        justify-content: center;
        > div {
          width: 100%;
          display: flex;
        }
        .top {
          order: -1;
          scale: 1;
          width: 100%;
        }
      }
    }
  }
  .filter-menu {
    left: 0;
    right: auto;
  }
`;

export const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  gap: 2rem;
  font-size: 14px;
  margin-bottom: 24px;
  .menu-item {
    font-weight: 600;
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 20px;
  }
  .selected {
    gap: 10px;
    .label {
      text-transform: uppercase;
      color: #7b7b7b;
    }
    .count {
      color: #dd3345;
    }
  }
  .select {
    width: fit-content;
  }
`;

export const LoadingWrapper = styled.div`
  font-size: 1.5rem;
  margin-top: 1rem;
`;

export const Filter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  .option {
    padding: 0.8em 1em;
    border-radius: 8px;
    color: #292929;
    box-shadow: 0px -1px 0px 0px #dbdbdb inset, 0px 0px 0px 0.5px #dbdbdb;
    transition: all 300ms ease-in-out;
    cursor: pointer;
    &.active,
    :hover {
      background: #292929;
      color: white;
    }
  }
  @media only screen and (max-width: 480px) {
    font-size: 10px;
  }
`;
