import styled from "styled-components";

export const Banner = styled.div<{ status: string }>`
  width: 100%;
  background: ${(props) => (props.status === "Pending" ? "#E6B800" : "#dd3345")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
  margin-bottom: 8px;
  border-radius: 4px;
`;
export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export const BannerText = styled.div`
  text-align: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0 8px;
  word-break: break-all;

  @media screen and (max-width: 768px) {
    font-size: 12px;
    margin-left: 4px;
  }
`;
