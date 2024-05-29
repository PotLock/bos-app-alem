import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 12px;
  border-top: 1px solid #292929;
  border-right: 1px solid #292929;
  border-bottom: 2px solid #292929;
  border-left: 1px solid #292929;
  overflow: hidden;
  .header {
    font-size: 18px;
    font-weight: 600;
    background: #fef6ee;
    padding: 1rem;
    span {
      color: #ee8949;
    }
  }
  .sort {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    font-size: 11px;
    background: #fef6ee;
    .title {
      font-weight: 500;
      letter-spacing: 0.44px;
      text-transform: uppercase;
    }
    .sort-btn {
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 1rem;
  gap: 8px;
  border-bottom: 1px solid #c7c7c7;
  &:last-of-type {
    border-bottom: none;
  }

  .address {
    display: flex;
    text-decoration: none;
    align-items: center;
    font-weight: 600;
    gap: 8px;
    margin-left: 24px;
    flex: 1;
    color: #292929;
    transition: color 200ms ease-in;
    :hover {
      color: #dd3345;
    }
  }
  .profile-image {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex !important;
  }
`;
// skeleton

const loadingSkeleton = styled.keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

export const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 360px;
  width: 100%;
  max-width: 514px;
  border-radius: 12px;
  border-width: 1px 1px 2px;
  border-style: solid;
  border-color: rgb(41, 41, 41);
  animation-name: ${loadingSkeleton};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  overflow: hidden;
`;
export const SkeletonHeader = styled.div`
  height: 90px;
  width: 100%;
  background: #eee;
`;

export const SkeletonRowItem = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem;
  gap: 8px;
  border-bottom: 1px solid #c7c7c7;
  &:last-of-type {
    border-bottom: none;
  }
`;

export const SkeletonAddress = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 24px;
  flex: 1;
`;

export const SkeleteonProfile = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #eee;
`;
export const SkeletonName = styled.div`
  width: 100px;
  height: 14px;
  background: #eee;
`;
export const SkeletonAmount = styled.div`
  width: 57px;
  height: 14px;
  background: #eee;
`;
