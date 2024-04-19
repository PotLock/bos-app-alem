import styled from "styled-components";
import Dropdown from "@app/components/Inputs/Dropdown/Dropdown";

const SelectPot = ({ selectedRound, activeRoundsOptions, updateState }: any) => {
  const PotSelector = styled.div`
    display: flex;
    > div:last-of-type {
      width: 100%;
    }
  `;

  return (
    <PotSelector>
      <Dropdown
        props={{
          sortVal: activeRoundsOptions ? activeRoundsOptions[selectedRound].label : "",
          showCount: false,
          sortList: Object.values(activeRoundsOptions),
          buttonStyle: {
            border: "1px solid #dbdbdb",
            padding: "0.75rem 1rem",
            borderBottomWidth: "2px",
            borderRadius: "6px",
            justifyContent: "space-between",
          },
          menuStyle: {
            top: "120%",
          },
          FilterMenuCustomStyle: `left:0; right:auto;`,
          handleSortChange: ({ val }: any) => {
            updateState({
              selectedRound: val,
            });
          },
        }}
      />
    </PotSelector>
  );
};

export default SelectPot;
