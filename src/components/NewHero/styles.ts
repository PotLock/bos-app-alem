import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

export const HeroContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  justify-content: center;
  border: 1px solid #f8d3b0;
  border-radius: 12px;
  overflow: hidden;
  .background {
    position: absolute;
    pointer-events: none;
    left: 0px;
    width: 100%;
    top: 0px;
    min-height: 600px;
  }
  .content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 64px 40px;
  }
  .sub-title {
    color: #dd3345;
    font-weight: 600;
    font-size: 16px;
    margin-top: 0;
    margin-bottom: 12px;
  }
  .title {
    letter-spacing: -0.4px;
    font-weight: 500;
    font-size: 40px;
    font-family: "Lora";
    margin: 0;
  }
  .btns {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-top: 40px;
    font-size: 14px;
    a,
    button {
      width: 180px;
    }
  }
  @media only screen and (max-width: 768px) {
    .content {
      padding: 48px 20px;
    }
    .title {
      font-size: 36px;
    }
    .btns {
      flex-direction: column;
      gap: 1rem;
      margin-top: 24px;
    }
    .line-break {
      display: none;
    }
  }
  @media only screen and (max-width: 480px) {
    .btns a,
    .btns button {
      width: 100%;
      padding: 12px 0;
    }
  }
`;

export const Line = styled.div`
  width: 100%;
  height: 1px;
  background: #ebebeb;
  margin-top: 1rem;
`;
