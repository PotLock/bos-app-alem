import styled from "styled-components";

export const ContainerHeader = styled.div<{ tab: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 48px;
  padding-top: 20px;
  @media screen and (min-width: 740px) and (max-width: 1400px) {
    padding-top: 120px;
  }
  /* mobile */
  @media screen and (max-width: 739px) {
    padding-top: 40px;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const Title = styled.div`
  color: #292929;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 1.12px;
  text-transform: uppercase;
`;

export const ProjectList = styled.div<{ maxCols?: number }>`
  display: grid;
  gap: 31px;

  /* For mobile devices (1 column) */
  @media screen and (max-width: 739px) {
    grid-template-columns: repeat(1, 1fr);
  }

  /* For tablet devices (2 columns) */
  @media screen and (min-width: 740px) and (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* For desktop devices (3 columns) */
  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(${!props.maxCols || props.maxCols > 2 ? "3" : "2"}, 1fr);
  }
`;

export const OnBottom = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
`;
