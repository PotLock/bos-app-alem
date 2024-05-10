import { context, useMemo } from "alem";
import HomeBannerStyle from "@app/assets/svgs/HomeBannerBackground";
import { useDonationModal } from "@app/hooks/useDonationModal";
import useModals from "@app/hooks/useModals";
import DonationStats from "@app/pages/Projects/components/DonationStats/DonationStats";
import getProjects from "@app/services/getProjects";
import Button from "../Button";
import { Container, HeroContainer, Line } from "./styles";

const NewHero = () => {
  const { allProjects, approvedProjects } = getProjects();

  // Start Modals provider
  const Modals = useModals();
  // Use specific modal context
  const { setDonationModalProps } = useDonationModal();

  const getRandomProject = () => {
    if (approvedProjects) {
      const randomIndex = Math.floor(Math.random() * approvedProjects.length);
      return approvedProjects[randomIndex]?.registrant_id;
    }
  };

  const openDonateRandomlyModal = () => {
    setDonationModalProps({
      projectId: getRandomProject(),
    });
  };

  const accountId = context.accountId;
  const isRegisteredProject = useMemo(() => {
    if (allProjects) {
      return allProjects.find((registration: any) => registration.registrant_id === accountId);
    }
  }, [allProjects]);

  return (
    <>
      <Modals />
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
              <Button onClick={openDonateRandomlyModal}>Donate Randomly</Button>

              <Button
                varient="tonal"
                href={isRegisteredProject ? `?tab=project&projectId=${accountId}` : "?tab=createproject"}
              >
                {isRegisteredProject ? "View Your Project" : "Register Your Project"}
              </Button>
            </div>
          </div>
        </HeroContainer>
        <DonationStats />
        <Line />
      </Container>
    </>
  );
};

export default NewHero;
