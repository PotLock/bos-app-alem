import styled from "styled-components";

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 800px;
  background: white;
  /* background: pink; */
  border: 1px solid #dbdbdb;
  box-shadow: 0px -2px 0px #dbdbdb inset;
  border-radius: 6px;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const ItemLeft = styled.div`
  height: 100%;
  padding: 24px 16px;
  /* background: green; */
`;

export const ItemRight = styled.div`
  display: flex;
  flex-direction: row;
  padding: 24px 24px 24px 16px;
  width: 100%;
  /* background: yellow; */
  border-left: 1px solid #dbdbdb;
`;

export const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
`;

export const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
`;

export const Title = styled.a`
  color: #2e2e2e;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  word-wrap: break-word;
`;

export const Description = styled.div`
  color: #2e2e2e;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  word-wrap: break-word;
  overflow-wrap: break-word;
  margin: 16px 0px 24px 0px;
`;

export const FtIcon = styled.img`
  width: 20px;
  height: 20px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Icon = styled.svg`
  width: 20px;
  height: 20px;
`;
