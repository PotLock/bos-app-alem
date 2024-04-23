import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > div:last-of-type {
    padding: 0px 175px;
  }
  @media only screen and (max-width: 992px) {
    > div:last-of-type {
      padding: 0px 20px;
    }
  }
`;

export const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 24px;
`;

export const HeaderTitle = styled.div`
  color: #292929;
  font-size: 60px;
  font-weight: 400;
  line-height: 72px;
  word-wrap: break-word;
  font-family: Lora;
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  justify-content: center;
  min-height: 400px;
  overflow: hidden;
  .background {
    position: absolute;
    pointer-events: none;
    height: 100%;
    left: 0;
    top: 0;
  }
  .content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 64px 175px;
  }
  .sub-title {
    letter-spacing: 1.12px;
    font-weight: 500;
    font-size: 14px;
    margin-top: 0;
    margin-bottom: 24px;
    text-transform: uppercase;
  }
  .title {
    letter-spacing: -0.4px;
    font-weight: 500;
    font-size: 40px;
    font-family: "Lora";
    margin: 0;
  }

  .info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    margin-top: 24px;
    > svg {
      height: 1em;
    }
  }

  @media only screen and (max-width: 992px) {
    .content {
      padding: 64px 20px;
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
    .btns a {
      width: 100%;
      padding: 12px 0;
    }
  }
`;
