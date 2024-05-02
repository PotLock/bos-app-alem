import styled from "styled-components";

const navHeightPx = 110;
const navHeightPxMobile = 96;

export const NavContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 0 40px;
  justify-content: start;
  align-items: center;
  align-self: stretch;
  height: ${navHeightPx}px;
  background: #ffffff;
  z-index: 1000;

  @media screen and (max-width: 768px) {
    padding: 24px 8px 24px 16px;
    height: ${navHeightPxMobile}px;
  }
  @media screen and (max-width: 480px) {
    padding: 24px 8px 24px 0px;
  }
  & > a {
    width: 10rem;
  }
`;

export const NavLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const NavRight = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const NavRightMobile = styled.div`
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    padding-right: 16px;
  }
`;

export const NavLogo = styled.div`
  a {
    display: flex;
    gap: 7px;
    align-items: baseline;
    text-align: center;
    color: #2e2e2e;
    font-size: 23.95px;
    font-weight: 700;
    line-height: 23.95px;
    word-wrap: break-word;
    margin-right: 48px;
    text-decoration: none;
    @media screen and (max-width: 480px) {
      font-size: 20px;
      margin-right: 1rem;
    }
    :hover {
      text-decoration: none;
    }
    img {
      height: 1em;
    }
  }
`;

export const NavTabs = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavTab = styled.div<{ disabled?: boolean; selected?: boolean }>`
  a {
    margin-right: 32px;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    color: ${(props) => (props.selected ? "#2E2E2E" : "#7B7B7B")};
    font-size: 14px;
    font-weight: ${(props) => (props.selected ? 500 : 400)};
    line-height: 16px;
    word-wrap: break-word;
    text-decoration: none;
    position: relative;

    :not(:last-child) {
      margin-right: 32px;
    }

    :hover {
      text-decoration: none;
    }
  }
`;

export const Banner = styled.div`
  width: 100%;
  background: #dd3345;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
`;

export const BannerText = styled.div`
  text-align: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-left: 8px;

  @media screen and (max-width: 768px) {
    font-size: 12px;
    margin-left: 4px;
  }
`;
export const BannerLinkContainer = styled.a`
  display: flex;
  cursor: pointer;
  text-align: center;
  font-weight: bold;
  color: white;
  font-size: 14px;
  line-height: 21px;
  margin-left: 16px;
  gap: 8px;

  &:hover {
    text-decoration: none;
  }

  @media screen and (max-width: 768px) {
    font-size: 12px;
    margin-left: 8px;
    gap: 4px;
  }
`;

export const BannerLinkSvg = styled.svg`
  width: 20px;
  height: 20px;
  fill: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: rotate(45deg);
  }

  @media screen and (max-width: 768px) {
    width: 16px;
    height: 16px;
  }
`;

export const BannerAlertSvg = styled.svg`
  width: 18px;

  @media screen and (max-width: 768px) {
    width: 14px;
  }
`;

export const NavMenu = styled.div`
  display: none;
  background: white;
  padding: 24px;
  width: 100%;
  gap: 16px;

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

export const NavMenuItem = styled.a<{ selected: boolean }>`
  color: ${(props) => (props.selected ? "#2E2E2E" : "#7B7B7B")};
  font-size: 14px;
  font-weight: ${(props) => (props.selected ? 500 : 400)};
  line-height: 20px;
  word-wrap: break-word;
  cursor: pointer;
`;
