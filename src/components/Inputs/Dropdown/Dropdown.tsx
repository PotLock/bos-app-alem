import { props, useState } from "alem";
import { FilterButton, FilterIcon, FilterItem, FilterMenu, Screen } from "./styles";

const Dropdown = ({ sortList, sortVal, title, handleSortChange, FilterMenuCustomStyle, showCount }: any) => {
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <>
      {openFilter && <Screen onClick={() => setOpenFilter(false)} />}
      <div style={{ position: "relative" }} onClick={() => setOpenFilter(!openFilter)}>
        <FilterButton style={props.buttonStyle || {}}>
          {sortVal || title}
          <FilterIcon>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 3.88667L10.1133 6L11.0533 5.06L8 2L4.94 5.06L5.88667 6L8 3.88667ZM8 12.1133L5.88667 10L4.94667 10.94L8 14L11.06 10.94L10.1133 10L8 12.1133Z"
                fill="#7B7B7B"
              />
            </svg>
          </FilterIcon>
        </FilterButton>
        {openFilter && (
          <FilterMenu
            onClick={(e) => e.stopPropagation()}
            style={props.menuStyle || {}}
            FilterMenuCustomStyle={FilterMenuCustomStyle}
          >
            {sortList.map((option: any) => (
              <FilterItem
                key={option.val}
                onClick={() => {
                  setOpenFilter(false);
                  handleSortChange(option);
                }}
              >
                {option.label} <div className="count">{showCount ? option.count : ""}</div>
              </FilterItem>
            ))}
          </FilterMenu>
        )}
      </div>
    </>
  );
};

export default Dropdown;
