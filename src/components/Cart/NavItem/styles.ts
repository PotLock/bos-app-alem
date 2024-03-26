import styled from "styled-components";

export const CartButton = styled.div<{ numCartItems: number }>`
  padding: ${(props) => (props.numCartItems > 0 ? "8px 8px 8px 16px" : "8px 16px")};
  background: #2e2e2e;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const CartText = styled.div`
  color: white;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  word-wrap: break-word;
  text-align: center;
`;

export const CartCountContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #f86b3f;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  margin-left: 8px;
`;
