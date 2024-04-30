import { Container, HeroContainer, Line } from "./styles";
import DonationStats from "@app/pages/Projects/components/DonationStats/DonationStats";
import HomeBannerStyle from "@app/assets/svgs/HomeBannerBackground";
import { context, useMemo, useState } from "alem";
import ModalDonation from "@app/modals/ModalDonation";

const NewHero = ({ projectsData }: any) => {
  const { allProjects, approvedProjects } = projectsData;
  const [donateTo, setDonateTo] = useState("");

  const getRandomProject = () => {
    if (approvedProjects) {
      const randomIndex = Math.floor(Math.random() * approvedProjects.length);
      return approvedProjects[randomIndex]?.registrant_id;
    }
  };

  const openDonateRandomlyModal = () => {
    setDonateTo(getRandomProject());
  };

  const closeDonateRandomlyModal = () => {
    setDonateTo("");
  };

  const accountId = context.accountId;
  const isRegisteredProject = useMemo(() => {
    if (allProjects) {
      return allProjects.find((registration: any) => registration.registrant_id === accountId);
    }
  }, [allProjects]);

  return (
    <Container>
      <HeroContainer
        style={{
          ...HomeBannerStyle,
        }}
      >
        <div className="content">
          <h3 className="sub-title">Transforming Funding for Public Goods</h3>
          <h1 className="title">
            Discover impact projects, donate directly, & <br className="line-break" /> participate in funding rounds.
          </h1>
          <div className="btns">
            <button onClick={openDonateRandomlyModal} className="donate-btn">
              Donate Randomly
            </button>

            <a href={isRegisteredProject ? `?tab=project&projectId=${accountId}` : "?tab=createproject"}>
              {isRegisteredProject ? "View Your Project" : "Register Your Project"}
            </a>
          </div>
        </div>
      </HeroContainer>
      <DonationStats />
      <Line />
      {donateTo && <ModalDonation projectId={donateTo} onClose={closeDonateRandomlyModal} />}
    </Container>
  );
};

export default NewHero;
