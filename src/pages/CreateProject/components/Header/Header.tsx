import HomeBannerStyle from "@app/assets/svgs/HomeBannerBackground";
import { HeaderContainer, HeaderDescription, HeaderTitle } from "./stlyes";

const Header = ({ edit }: { edit: boolean }) => {
  return (
    <HeaderContainer
      style={{
        ...HomeBannerStyle,
      }}
    >
      <HeaderTitle>{edit ? "Edit" : "Register New"} Project</HeaderTitle>
      <HeaderDescription>
        Create a profile for your project to receive donations and qualify for funding rounds.
      </HeaderDescription>
    </HeaderContainer>
  );
};

export default Header;
