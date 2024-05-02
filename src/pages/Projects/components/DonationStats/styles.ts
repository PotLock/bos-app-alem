import styled from "styled-components";

export const Stats = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
  padding: 0 40px;
  @media screen and (max-width: 768px) {
    gap: 1rem;
    padding: 0 8px;
  }
`;

export const StatsTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 8px;
  font-weight: 600;
  font-size: 20px;
  color: #dd3345;
`;

export const StatsSubTitle = styled.div`
  color: #656565;
  font-size: 14px;
  font-weight: 400;
`;
