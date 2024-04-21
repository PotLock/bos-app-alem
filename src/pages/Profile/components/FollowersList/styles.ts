import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .profile-row {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
  .btn-primary {
    background-color: #dd3345;
    border: none;
    transition: all 300ms;
    :hover {
      opacity: 0.8;
    }
  }
`;
