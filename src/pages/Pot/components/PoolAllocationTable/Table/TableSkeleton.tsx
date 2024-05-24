import {
  SkeletonContainer,
  SkeletonHeader,
  SkeletonRowItem,
  SkeletonAddress,
  SkeleteonProfile,
  SkeletonName,
  SkeletonAmount,
} from "./styles";

const TableSkeleton = () => {
  return (
    <SkeletonContainer>
      <SkeletonHeader />
      {new Array(5).fill(0).map((_, idx) => (
        <SkeletonRowItem>
          <div>#{idx + 1}</div>
          <SkeletonAddress>
            <SkeleteonProfile />
            <SkeletonName />
          </SkeletonAddress>
          <SkeletonAmount />
        </SkeletonRowItem>
      ))}
    </SkeletonContainer>
  );
};

export default TableSkeleton;
