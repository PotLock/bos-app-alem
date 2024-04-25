import styled from "styled-components";

export const Banner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px;
  backdrop-filter: blur(150px);
`;
export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export const BannerText = styled.div`
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.015em;
  text-transform: uppercase;
  @media screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
export const Toggle = styled.span`
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 22px;
  white-space: nowrap;
  margin-left: 0.5rem;

  svg {
    width: 12px;
    transition: all 300ms ease-in-out;
  }
  &.active svg {
    rotate: 180deg;
  }
  @media screen and (max-width: 768px) {
    font-size: 12px;
    svg {
      width: 8px;
    }
  }
`;

export const Notes = styled.div`
  overflow: hidden;
  transition: all 300ms ease-in-out;
  font-size: 12px;
  font-style: italic;
  max-height: 0;
  text-transform: uppercase;
  max-width: 1270px;
  &.active {
    max-height: 80px;
    margin-top: 12px;
  }
`;
