import styled from "styled-components";

export const Wrapper = styled.div`
  border-top: 1px solid rgb(199 199 199 / 50%);
  border-bottom: 1px solid rgb(199 199 199 / 50%);
  position: relative;
  display: flex;
  align-items: center;
  margin-top: -1px;
  pointer-events: none;
  .spread-indicator {
    height: auto;
    width: 12px;
    transition: all 300ms ease-in-out;
    display: none;
  }
  @media only screen and (max-width: 1100px) {
    pointer-events: all;
    cursor: pointer;
    .spread-indicator {
      display: block;
    }
  }
`;

export const State = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  gap: 1rem;
  font-size: 14px;
  white-space: nowrap;
  span {
    font-weight: 600;
    color: #dd3345;
  }
`;

export const Loader = styled.div`
  position: relative;
  background: #dbdbdb;
  border-radius: 1px;
  height: 4px;
  width: 130px;
  @media only screen and (max-width: 1400px) {
    width: 90px;
  }
  @media only screen and (max-width: 1100px) {
    height: 40px;
    width: 4px;
    position: absolute;
    left: 10px;
    z-index: 0;
    top: 50%;
  }
`;

export const ProgressBarWrapper = styled.div`
  position: relative;
  display: flex;
  .circle {
    width: 24px;
    height: 24px;
    transform: rotate(-90deg);
  }
  .check {
    width: 12px;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
  }
  @media only screen and (max-width: 1100px) {
    z-index: 1;
    background: white;
    padding: 2px 0;
  }
`;
