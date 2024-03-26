import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  padding: 3rem 4rem 24px;
  @media screen and (max-width: 768px) {
    padding: 24px 1rem;
  }
`;

export const SidebarContainer = styled.div`
  width: 15%;
  padding-left: 1rem;
  @media screen and (max-width: 768px) {
    width: fit-content;
    > div:first-of-type {
      display: none;
    }
  }
`;

export const ModalTitle = styled.div`
  color: #525252;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  word-wrap: break-word;
  margin-bottom: 8px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
