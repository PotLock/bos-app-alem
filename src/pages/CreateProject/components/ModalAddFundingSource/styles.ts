import styled from "styled-components";

export const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: #f6f5f3;
  padding: 10px 20px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
`;

export const ModalHeaderText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #292929;
  line-height: 24px;
  word-wrap: break-word;
  margin-left: 8px;
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 20px 32px 20px;
  gap: 24px;
`;

export const Icon = styled.svg`
  width: 20px;
  height: 20px;
`;
export const CloseIcon = styled.svg`
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: rotate 300ms ease-in-out;
  :hover {
    rotate: 180deg;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
