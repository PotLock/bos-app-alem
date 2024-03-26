import styled from "styled-components";

export const LinktreeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  -webkit-box-pack: start;
  justify-content: flex-start;
  gap: 1rem;
  width: 100%;
`;

export const LinktreeItemContainer = styled.a`
  display: flex;
`;

export const LinkText = styled.a<{ disabled?: boolean }>`
  font-size: 14px;
  color: gray;
  font-weight: 400;
  margin-left: 16px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    text-decoration: none;
  }
`;
