import styled from "styled-components";

export const MembersListItem = styled.div`
  padding: 16px 0px;
  border-top: 1px #f0f0f0 solid;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const MembersListItemLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
`;

export const MembersListItemText = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #2e2e2e;
`;

export const RemoveMember = styled.a`
  color: #2e2e2e;
  font-size: 14px;
  font-weight: 600;
  visibility: hidden;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    text-decoration: none;
  }

  ${MembersListItem}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;
