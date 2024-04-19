import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  > div {
    display: flex;
    border-radius: 8px;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    cursor: pointer;
    border: 1px solid #dbdbdb;
    color: #7b7b7b;
    background: white;
    transition: all 300ms;
    .text {
      flex: 1;
      font-weight: 500;
    }
    &.active {
      box-shadow: 0px 0px 1.4px 2px #fee6e5;
      color: #dd3345;
      border-color: #dd3345;
      span {
        color: #7b7b7b;
      }
    }
    &.disabled {
      pointer-events: none;
      color: #a6a6a6;
      background: #f6f5f3;
      span {
        color: #a6a6a6;
      }
    }
  }
`;

export const CheckBox = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #d9d9d9;
  display: flex;
  border-radius: 50%;
  div {
    width: 10px;
    height: 10px;
    background: transparent;
    border-radius: 50%;
    margin: auto;
  }
  &.active {
    border-color: #dd3345;
    div {
      background: #dd3345;
    }
  }
`;
