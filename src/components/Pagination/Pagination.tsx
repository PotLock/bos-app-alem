import { useMemo } from "alem";
import { Container } from "./styles";

type Props = {
  onPageChange: (page: number) => void;
  data: any;
  currentPage: number;
  perPage: number;
  customClass?: string;
  showArrows?: boolean;
  siblingCount?: number;
};

type Pagination = {
  currentPage: number;
  perPage: number;
  totalCount: number;
  siblingCount: number;
};

const Pagination = (props: Props) => {
  const DOTS = "...";

  const range = (start: number, end: number) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const usePagination = ({ totalCount, perPage, siblingCount, currentPage }: Pagination) => {
    const paginationRange = useMemo(() => {
      const totalPageCount = Math.ceil(totalCount / perPage);

      const totalPageNumbers = siblingCount + 3;

      if (totalPageNumbers >= totalPageCount || totalPageCount < 6) {
        return range(1, totalPageCount);
      }

      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex <= totalPageCount - 3;

      const firstPageIndex = 1;
      const lastPageIndex = totalPageCount;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        let leftItemCount = 3 + siblingCount;
        let leftRange = range(1, leftItemCount);

        return [...leftRange, DOTS, totalPageCount];
      }

      if (shouldShowLeftDots && !shouldShowRightDots) {
        let rightItemCount = 3 + siblingCount;
        let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
        return [firstPageIndex, DOTS, ...rightRange];
      }

      if (shouldShowLeftDots && shouldShowRightDots) {
        let middleRange = range(leftSiblingIndex, rightSiblingIndex);
        return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
      }
      if (!shouldShowLeftDots && !shouldShowRightDots) {
        return range(1, totalPageCount);
      }
    }, [totalCount, perPage, siblingCount, currentPage]);

    return paginationRange;
  };

  const { onPageChange, data, currentPage, perPage } = props;
  const siblingCount = props.siblingCount ?? 1;
  const showArrows = props.showArrows ?? false;
  const totalCount = data?.length;

  const paginationRange =
    usePagination({
      currentPage,
      totalCount,
      siblingCount,
      perPage,
    }) || [];

  if (currentPage === 0 || paginationRange.length < 2) {
    return "";
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <Container>
      {showArrows && (
        <li className={`${currentPage === 1 ? "disabled" : ""}`} onClick={onPrevious}>
          <div className="arrow left" />
        </li>
      )}
      {paginationRange?.length > 0 &&
        paginationRange.map((pageNumber: any) => {
          if (pageNumber === DOTS) {
            return <li className="pagination-item dots">&#8230;</li>;
          }

          return (
            <li
              key={pageNumber}
              className={`pagination-item ${pageNumber === currentPage ? "selected" : ""}`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </li>
          );
        })}
      {showArrows && (
        <li className={`${currentPage === lastPage ? "disabled" : ""}`} onClick={onNext}>
          <div className="arrow right" />
        </li>
      )}
    </Container>
  );
};

export default Pagination;
