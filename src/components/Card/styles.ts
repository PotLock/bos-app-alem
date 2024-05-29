import styled from "styled-components";

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 420px;
  min-height: 405px;
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
  border-radius: 12px;
  background: white;
  box-shadow: 0px -2px 0px #dbdbdb inset;
  border: 1px solid #dbdbdb;
  margin-left: auto;
  margin-right: auto;
  transition: all 300ms;
  &:hover {
    transform: translateY(-1rem);
  }
`;

export const HeaderContainer = styled.div`
  padding-left: 16px;
  &:hover {
    text-decoration: none;
    cursor: pointer;
  }
  @media screen and (max-width: 768px) {
    border-radius: 0;
  }
`;

export const backgroundStyleHeightPx = 168;

export const BackgroundImageContainer = styled.div`
  svg {
    position: absolute;
    top: ${backgroundStyleHeightPx / 2}px;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 2;
    pointer-events: none;
  }
`;

export const ProfileImageContainer = styled.div`
  transform: translateY(138px);
  width: 40px;
  height: 40px;
  position: absolute;

  img {
    width: 40px;
    height: 40px;
  }

  &:hover {
    cursor: pointer;

    &:after {
      /*  Dark overlay with 40% opacity on hover */
      background-color: rgba(45.9, 45.9, 45.9, 0.4);
    }

    svg {
      opacity: 1; /* Make the image visible on hover */
    }
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 176px;
  padding: 16px 24px;
  gap: 16px;
  flex: 1;
`;

export const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #2e2e2e;
  width: 100%;
`;

export const SubTitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #2e2e2e;
  word-wrap: break-word;
`;

export const DonationsInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  width: 100%;
  border-top: 1px #f0f0f0 solid;
`;

export const DonationsInfoItem = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

export const Amount = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: #292929;
  line-height: 24px;
`;

export const AmountDescriptor = styled.div`
  font-size: 11px;
  font-weight: 400;
  color: #525252;
  word-wrap: break-word;
  text-transform: uppercase;
  line-height: 16px;
  letter-spacing: 1.1px;
`;

export const Tags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Tag = styled.span`
  box-shadow: 0px -0.699999988079071px 0px rgba(123, 123, 123, 0.36) inset;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(123, 123, 123, 0.36);
  color: #2e2e2e;
`;

export const MatchingSection = styled.div`
  display: flex;
  padding: 8px 24px;
  align-items: center;
  justify-content: space-between;
  background: #ebebeb;
  border-radius: 0px 0px 12px 12px;
`;

export const MatchingTitle = styled.div`
  color: #292929;
  font-size: 11px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  word-wrap: break-word;
`;

export const MatchingAmount = styled.div`
  color: #292929;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  word-wrap: break-word;
`;
