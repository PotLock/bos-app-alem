import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 64px;
  @media screen and (max-width: 768px) {
    padding-top: 64px;
  }
`;
export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;
export const ProjectsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow-y: hidden;
  padding-top: 5px;
  > div {
    width: 100%;
  }
`;

export const FilterWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  width: 100%;
  .filter-menu {
    left: 0;
    right: auto;
  }
  .left-side-menu {
    left: auto;
    right: 0;
  }
  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
    > div:nth-of-type(2) {
      width: 100%;
      order: -1;
      flex: auto;
    }
    .filter-menu {
      width: 250px !important;
    }
    .left-side-menu {
      right: auto;
      left: 0;
    }
  }
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
