import BannerAlertSvg from "../../../../assets/svgs/banner-alert";
import { Project } from "../../../../types";
import { Banner, BannerText, Row } from "./styles";

type Props = {
  project: Project;
};

const ProjectBanner = ({ project }: Props) => {
  return (
    <Banner status={project.status}>
      <Row>
        <BannerAlertSvg />
        <BannerText>This project status is {project.status} and has not been approved.</BannerText>
      </Row>
      {project.review_notes && (
        <BannerText style={{ fontStyle: "italic" }}>Admin review notes: {project.review_notes}</BannerText>
      )}
    </Banner>
  );
};

export default ProjectBanner;
