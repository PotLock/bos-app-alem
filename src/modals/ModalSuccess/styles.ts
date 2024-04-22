import styled from "styled-components";

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const ModalMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 2rem;
  padding: 40px 32px;
`;

export const ModalFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: #f6f5f3;
  gap: 12px;
  padding: 28px 36px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`;

export const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const HeaderIcon = styled.div`
  padding: 12px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #dd3345;
  box-shadow: 0px 0px 0px 6px #fee6e5;
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const TwitterShare = styled.a`
  display: flex;
  gap: 8px;
  color: white;
  border-radius: 4px;
  padding: 6px 1rem;
  background: rgb(41, 41, 41);
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  :hover {
    text-decoration: none;
  }
`;
export const ModalMiddel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  .amount-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    img,
    svg {
      width: 20px;
      height: 20px;
    }
    img {
      border-radius: 50%;
    }
  }
`;

export const Amount = styled.div`
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.33px;
  text-transform: uppercase;
`;

export const AmountUsd = styled.div`
  color: #7b7b7b;
  font-size: 22px;
`;

export const ProjectName = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 14px;
  div {
    color: #7b7b7b;
  }
  a {
    color: #525252;
    &:hover {
      text-decoration: none;
    }
  }
`;

export const H1 = styled.h1`
  color: #292929;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  word-wrap: break-word;
`;

export const TextBold = styled.div`
  color: #292929;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  word-wrap: break-word;
`;

export const UserChip = styled.div`
  display: flex;
  flex-direction: row;
  padding: 2px 12px;
  gap: 4px;
  border-radius: 32px;
  background: #ebebeb;
`;

export const UserChipLink = styled.a`
  display: flex;
  flex-direction: row;
  padding: 2px 12px;
  gap: 4px;
  border-radius: 32px;
  background: #ebebeb;

  &:hover {
    text-decoration: none;
  }
`;

export const ShareText = styled.div`
  color: #7b7b7b;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  word-wrap: break-word;
`;

export const SocialIcon = styled.svg`
  width: 24px;
  height: 24px;
  cursor: pointer;
  path {
    transition: 300ms;
  }
  :hover path {
    fill: #dd3345;
  }
`;
