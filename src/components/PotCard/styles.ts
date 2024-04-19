import styled from "styled-components";

export const Card = styled.a`
  display: flex;
  flex-direction: column;
  min-width: 320px;
  min-height: 300px;
  border-radius: 8px;
  background: white;
  box-shadow: 0px -2px 0px 0px #464646 inset, 0px 0px 0px 1px #464646;
  padding-bottom: 5px;
  height: 100%;
  &:hover {
    text-decoration: none;
    cursor: pointer;
  }
`;

export const CardSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 16px;
  padding: 32px;
  width: 100%;
  height: 100%;
`;

export const Title = styled.div`
  color: #292929;
  font-size: 22px;
  font-weight: 600;
  line-height: 28px;
  word-wrap: break-word;
  > div {
    font-weight: inherit;
    display: flex;
    align-items: baseline;
  }
  .usd-amount {
    font-size: 14px;
    font-weight: 400;
    margin-left: 0.25rem;
  }
  .text {
    font-size: 14px;
    color: #7b7b7b;
    margin-left: 0.5rem;
  }
`;

export const Description = styled.div`
  color: #525252;
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  word-wrap: break-word;
  a {
    color: rgb(123, 123, 123);
  }
`;

export const Subtitle = styled.span`
  color: #7b7b7b;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  word-wrap: break-word;
`;
