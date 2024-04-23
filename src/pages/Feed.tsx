import ListsSDK from "@app/SDK/lists";
import styled from "styled-components";
import Feed from "./Project/NavPages/Feed/Feed";

const FeedPage = () => {
  const registrations = ListsSDK.getRegistrations() || [];

  const registrantIds = registrations
    .filter((reg: any) => reg.status === "Approved")
    .map((reg: any) => reg.registrant_id);

  const Container = styled.div`
    padding: 24px 64px;

    @media screen and (max-width: 768px) {
      padding: 24px 16px;
    }
  `;

  return (
    <Container>
      <Feed key="feed" accounts={registrantIds} />
    </Container>
  );
};

export default FeedPage;
