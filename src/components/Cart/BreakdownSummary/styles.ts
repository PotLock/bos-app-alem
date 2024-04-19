import styled from "styled-components";

export const SvgIcon = styled.svg`
  width: 16px;
  height: 16px;
`;

export const BreakdownSummaryContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .breakdown-details {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 8px;
    gap: 12px;
    border: 1px #dbdbdb solid;
    border-radius: 8px;
    transition: all 300ms ease-in-out;
    &.hidden {
      visibility: hidden;
      height: 0;
      opacity: 0;
      transform: translateY(100px);
    }
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

export const BreakdownTitle = styled.div`
  color: #2e2e2e;
  font-size: 14px;
  font-weight: 500;
  word-wrap: break-word;
`;

export const ChevronIcon = styled.svg`
  width: 1rem;
  height: 1rem;
  margin-left: 8px;
  transition: all 300ms ease-in-out;
`;

export const BreakdownDetails = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 8px;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  border: 1px #dbdbdb solid;
  background: #fafafa;
  transition: all 300ms ease-in-out;
`;

export const BreakdownItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
  :first-of-type {
    padding-top: 1rem;
  }
  :last-of-type {
    padding-bottom: 1rem;
  }
`;

export const BreakdownItemLeft = styled.div`
  color: #7b7b7b;
  font-size: 14px;
  font-weight: 400;
  word-wrap: break-word;
`;

export const BreakdownItemRight = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 500;
  gap: 8px;
`;

export const BreakdownAmount = styled.div`
  color: #2e2e2e;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  word-wrap: break-word;
`;

export const Icon = styled.img`
  width: 16px;
  height: 16px;
`;
