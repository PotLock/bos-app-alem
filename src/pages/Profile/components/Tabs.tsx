import styled from "styled-components";

type Props = {
  navOptions: any;
  nav: string;
};

const Tabs = ({ navOptions, nav }: Props) => {
  const getSelectedNavOption = () => {
    const navOption = navOptions.find((option: any) => option.id == nav);
    return navOption ?? navOptions[0];
  };

  const NavOptionsContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: 2rem;
    width: 100%;
    border-bottom: 1px solid #c7c7c7;
    padding: 0 4rem;
    .nav-option {
      font-size: 14px;
      color: #7b7b7b;
      padding: 10px 16px;
      font-weight: 500;
      white-space: nowrap;
      border-bottom: 2px solid transparent;
      transition: 300ms ease;
      &.disabled {
        pointer-events: none;
        cursor: not-allowed;
      }
      &.selected {
        color: #292929;
        border-bottom-color: #292929;
      }
      :hover {
        border-bottom-color: #292929;
        text-decoration: none;
      }
    }
    @media screen and (max-width: 768px) {
      padding: 0px 1rem;
      overflow-x: scroll;
      .nav-option.selected {
        order: -1;
      }
    }
  `;

  const Link = styled("Link")``;

  return (
    <NavOptionsContainer>
      {navOptions.map((option: any) => {
        const selected = option.id == getSelectedNavOption().id;
        return option.label ? (
          <Link className={`nav-option ${selected && "selected"} ${option.disabled && "disabled"}`} to={option.href}>
            {option.label}
          </Link>
        ) : (
          ""
        );
      })}
    </NavOptionsContainer>
  );
};

export default Tabs;
