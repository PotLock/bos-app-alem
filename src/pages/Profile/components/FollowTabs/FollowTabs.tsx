import hrefWithParams from "@app/utils/hrefWithParams";
import FollowersList from "../FollowersList/FollowersList";
import { Container, Nav } from "./styles";

const FollowTabs = (props: any) => {
  const { accountId, projectId, nav } = props;
  const profileLink = hrefWithParams(`?tab=profile&accountId=${accountId}`);

  return (
    <Container>
      <Nav>
        <ul className="nav nav-pills nav-fill" role="tablist">
          <li className="nav-item" role="presentation">
            <a
              href={`${profileLink}&nav=followers`}
              className={`btn nav-link ${nav === "followers" ? "active" : ""}`}
              role="tab"
            >
              Followers
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              href={`${profileLink}&nav=following`}
              className={`btn nav-link ${nav === "following" ? "active" : ""}`}
              role="tab"
            >
              Following
            </a>
          </li>
        </ul>
      </Nav>
      <div className="tab-content">
        <div className="tab-pane fade in show active" role="tabpanel">
          <FollowersList accountId={projectId || accountId} nav={nav} />
        </div>
      </div>
    </Container>
  );
};

export default FollowTabs;
