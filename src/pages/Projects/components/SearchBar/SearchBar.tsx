import { useState } from "alem";
import { FilterButton, FilterIcon, FilterItem, FilterMenu, Row, SearchBarInput, SearchIcon } from "./styles";

type SearchProps = {
  title: string;
  numItems: number;
  itemName: string;
  sortList: string[];
  sortVal?: string;
  handleSortChange: (filter: string) => void;
  setSearchTerm: any;
  FilterMenuClass?: string;
};

const SearchBar = (props: SearchProps) => {
  const { title, numItems, itemName, sortList, sortVal, handleSortChange, setSearchTerm, FilterMenuClass } = props;
  const onSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const [openFilter, setOpenFilter] = useState(false);

  return (
    <>
      <Row>
        <SearchIcon>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.7549 11.2559H11.9649L11.6849 10.9859C12.6649 9.8459 13.2549 8.3659 13.2549 6.75586C13.2549 3.16586 10.3449 0.255859 6.75488 0.255859C3.16488 0.255859 0.254883 3.16586 0.254883 6.75586C0.254883 10.3459 3.16488 13.2559 6.75488 13.2559C8.3649 13.2559 9.8449 12.6659 10.9849 11.6859L11.2549 11.9659V12.7559L16.2549 17.7459L17.7449 16.2559L12.7549 11.2559ZM6.75488 11.2559C4.26488 11.2559 2.25488 9.2459 2.25488 6.75586C2.25488 4.26586 4.26488 2.25586 6.75488 2.25586C9.2449 2.25586 11.2549 4.26586 11.2549 6.75586C11.2549 9.2459 9.2449 11.2559 6.75488 11.2559Z"
              fill="#7B7B7B"
            />
          </svg>
        </SearchIcon>
        <SearchBarInput
          placeholder={`Search (${numItems}) ${numItems === 1 ? itemName : itemName + "s"}`}
          onChange={onSearchChange}
          type="text"
        />
      </Row>
      <div style={{ position: "relative" }} onClick={() => setOpenFilter(!openFilter)}>
        <FilterButton className={openFilter ? "active" : ""}>
          {sortVal || title}
          <FilterIcon>
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12H6V10H0V12ZM0 0V2H18V0H0ZM0 7H12V5H0V7Z" fill="#7B7B7B" />
            </svg>
          </FilterIcon>
        </FilterButton>
        <FilterMenu
          onClick={(e) => e.stopPropagation()}
          className={`${FilterMenuClass || ""} ${openFilter ? "active" : ""} `}
        >
          {(sortList || []).map((filter: string) => (
            <FilterItem
              key={filter}
              onClick={() => {
                setOpenFilter(false);
                handleSortChange(filter);
              }}
            >
              {filter}
            </FilterItem>
          ))}
        </FilterMenu>
      </div>
    </>
  );
};

export default SearchBar;
