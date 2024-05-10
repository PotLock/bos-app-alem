import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
export const Title = styled.div`
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: fit-content;
  margin-bottom: 1.5rem;
  div:first-of-type {
    font-weight: 600;
  }
`;

export const SearchBar = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  border-radius: 6px;
  border: 0.5px solid #292929;
  margin-bottom: 0.5rem;
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
  }
  input {
    font-size: 14px;
    background: transparent;
    width: 100%;
    height: 100%;
    padding: 12px 16px 12px 3rem;
    border: none;
    outline: none;
  }
  @media only screen and (max-width: 768px) {
    svg {
      left: 1rem;
    }

    input {
      padding: 8px 24px 8px 54px;
    }
  }
`;

export const Centralized = styled.div`
  display: flex;
  justify-content: center;
`;
