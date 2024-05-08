import { useState } from "alem";
import statuses from "./statuses";
import { Banner, BannerText, Row, Notes, Toggle } from "./styles";

type Props = {
  registration: any;
};

const ProjectBanner = ({ registration }: Props) => {
  const [toggle, setToggle] = useState(false);

  const registrationStatus = registration ? statuses[registration.status] : statuses.Unregistered;

  return (
    <Banner
      style={{
        background: registrationStatus.background,
      }}
    >
      <Row>
        <BannerText
          onClick={() => (registration.admin_notes ? setToggle(!toggle) : "")}
          style={{
            color: registrationStatus.textColor,
            cursor: registration.admin_notes ? "pointer" : "default",
          }}
        >
          {registrationStatus.text}
          {registration.admin_notes && (
            <Toggle
              className={`${toggle ? "active" : ""}`}
              style={{
                color: registrationStatus.toggleColor,
              }}
            >
              (See {toggle ? "Less" : "Why"})
              <svg
                className={`${toggle ? "active" : ""}`}
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.59 0.294922L6 4.87492L1.41 0.294922L0 1.70492L6 7.70492L12 1.70492L10.59 0.294922Z"
                  fill="#C7C7C7"
                  style={{
                    fill: registrationStatus.toggleColor,
                    stroke: registrationStatus.toggleColor,
                  }}
                />
              </svg>
            </Toggle>
          )}
        </BannerText>
      </Row>
      {registration.admin_notes && (
        <Notes className={`${toggle ? "active" : ""}`} style={{ color: registrationStatus.toggleColor }}>
          Admin notes: {registration.admin_notes}
        </Notes>
      )}
    </Banner>
  );
};

export default ProjectBanner;
