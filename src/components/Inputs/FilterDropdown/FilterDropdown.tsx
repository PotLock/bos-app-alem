import DropdownCenter from "@app/assets/svgs/DropdownCenter";
import { Container, Count, Label, Menu, Screen } from "./styles";
import { useState } from "alem";
import DropdownRight from "@app/assets/svgs/DropdownRight";

type Props = {
  onClick: (option: any) => void;
  menuClass?: string;
  label?: string;
  multipleOptions?: boolean;
  defaultSelected?: any;
  options: any;
  labelIcon?: "center" | "right";
};

const FilterDropdown = (props: Props) => {
  const { onClick, menuClass, label, multipleOptions, defaultSelected } = props;
  const labelIcon = props.labelIcon ?? "center";
  const options = props.options ?? {};

  const [toggleMenu, setToggleMenu] = useState(false);
  const [selected, setSelected] = useState(defaultSelected || {});

  const icons = {
    center: <DropdownCenter />,
    right: <DropdownRight />,
  };

  function findIndexWithAll(listOfLists: any, target: string) {
    for (let i = 0; i < listOfLists.length; i++) {
      const indexInList = listOfLists[i].indexOf(target);
      if (indexInList !== -1) {
        return { listIndex: i, itemIndex: indexInList };
      }
    }
    return { listIndex: -1, itemIndex: -1 }; // Not found
  }

  const handleSelect = ({ val, type, label }: { val: string; type: string; label: string }) => {
    let selectedUpdated = { ...selected };
    const selectedList = selected[type] || [];

    if (!multipleOptions) {
      selectedUpdated = { val, label };
    } else if (selectedList.includes(val)) {
      selectedUpdated[type] = selectedList.filter((item: any) => item !== val);
    } else {
      selectedUpdated[type] = [...selectedList, val];
    }

    const { listIndex, itemIndex } = findIndexWithAll(Object.values(selectedUpdated), "all");

    const types = Object.keys(selectedUpdated);

    // remove filters if all is selected
    if (val === "all") {
      selectedUpdated = {
        [type]: [val],
      };
    }
    // remove all if another filter is selected
    else if (listIndex !== -1) {
      selectedUpdated[types[listIndex]].splice(itemIndex, 1);
    }

    setSelected(selectedUpdated);

    onClick(selectedUpdated);
    setToggleMenu(false);
  };

  const count = Object.values(selected).reduce((total, list: any) => total + list.length, 0) as number;

  return (
    <Container>
      {toggleMenu && <Screen onClick={() => setToggleMenu(false)} />}

      <Label className={toggleMenu ? "active" : ""} onClick={() => setToggleMenu(!toggleMenu)}>
        {label || "Filter"}
        {multipleOptions && <Count className={toggleMenu ? "active" : ""}>{count}</Count>}
        <div>{icons[labelIcon]}</div>
      </Label>
      <Menu className={`${toggleMenu ? "active" : ""} ${menuClass ?? ""}`}>
        {Object.keys(options)?.map((menuLabel) => (
          <>
            <div className="title">Filter by {menuLabel.includes("no label") ? "" : menuLabel}</div>
            {(options[menuLabel] || [])?.map(({ label, val }: any) => (
              <div
                className={`option ${multipleOptions && (selected[menuLabel] || [])?.includes(val) && "selected"}`}
                key={val}
                onClick={() => handleSelect({ label, val, type: menuLabel })}
              >
                <svg viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.59625 8.90631L1.46875 5.77881L0.403748 6.83631L4.59625 11.0288L13.5962 2.02881L12.5387 0.971313L4.59625 8.90631Z"
                    fill="#F4B37D"
                  />
                </svg>

                {label}
              </div>
            ))}
          </>
        ))}
      </Menu>
    </Container>
  );
};

export default FilterDropdown;
