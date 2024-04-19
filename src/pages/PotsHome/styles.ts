import styled from "styled-components";

export const Title = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 18px;
  font-weight: 600;
  .span {
    font-weight: 600;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 48px;
  .content {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 64px;
    margin-top: 3rem;
  }
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    .filters {
      gap: 1rem;
      display: flex;
      align-items: center;
      .sort {
        width: 286px;
        flex-direction: column;
        padding: 0.5rem;
        gap: 0;
        .title {
          display: none;
        }
        .option {
          border: none;
          width: 100%;
          padding: 0.5rem;
        }
      }
    }
  }
  @media only screen and (max-width: 768px) {
    .content {
      padding: 0 20px;
    }
    .header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }
`;

export const Line = styled.div`
  height: 1px;
  width: 100%;
  background: #c7c7c7;
  margin: 3rem 0;
`;
