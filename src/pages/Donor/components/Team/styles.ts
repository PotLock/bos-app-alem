import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Title = styled.div`
  color: #2e2e2e;
  font-size: 16px;
  font-weight: 600;
`;

export const TeamMembersContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
`;

export const TeamMemberItem = styled.a`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8px;
  cursor: pointer;
  :hover {
    text-decoration: none;
    .profile-image img {
      filter: grayscale(0%);
    }
  }
  .profile-image {
    width: 180px;
    height: 180px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
      filter: grayscale(100%);
      transition: 300ms ease-in-out;
    }
  }
  @media screen and (max-width: 768px) {
    .profile-image {
      width: 160px;
      height: 160px;
    }
  }
`;

export const TeamMemberAccountId = styled.div`
  color: #2e2e2e;
  font-size: 16px;
  font-weight: 400;
`;

export const imageWidthPx = 129;

export const Col1 = styled.div`
  display: flex;
  width: 30%;
  margin-bottom: 1rem;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

export const Col2 = styled.div`
  display: flex;
  width: 70%;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;
