import styled from "styled-components";

export const TagsWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  color: #292929;
`;

export const Tag = styled.div`
  display: flex;
  padding: 8px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0px -1px 0px 0px #c7c7c7 inset, 0px 0px 0px 0.5px #c7c7c7;
  border: 1px solid #c7c7c7;
  cursor: pointer;
  &:hover {
    background: #fef6ee;
  }
`;
