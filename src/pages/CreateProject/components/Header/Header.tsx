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
        Create a profile for your impact project to receive direct donations, Qualify for funding rounds, join NEAR's
        accelerator, and get discovered across social platforms.
      </HeaderDescription>
    </HeaderContainer>
  );
};

export default Header;
