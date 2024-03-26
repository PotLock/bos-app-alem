import styled from "styled-components";

// Loading Skeleton
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

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  animation-name: ${loadingSkeleton};
  animation-duration: 1s;
  animation-iteration-count: infinite;
`;

const LoadingBackground = styled.div`
  position: relative;
  background: #eee;
  width: 100%;
  height: 318px;
  @media screen and (max-width: 768px) {
    height: 264px;
  }
`;
const LoadingProfileImg = styled.div<{ imageStyle?: { width: number; height: number } }>`
  width: ${(props) => props.imageStyle?.width ?? "128px"};
  height: ${(props) => props.imageStyle?.height ?? "128px"};
  z-index: 1;
  padding: 6px;
  transform: translateY(-50%);
  position: relative;
  margin-left: 4rem;
  background: white;
  border-radius: 50%;
  @media screen and (max-width: 768px) {
    margin-left: 1rem;
  }
  div {
    background: #eee;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

const BannerSkeleton = () => (
  <SkeletonContainer>
    <LoadingBackground />
    <LoadingProfileImg>
      <div />
    </LoadingProfileImg>
  </SkeletonContainer>
);

export default BannerSkeleton;
