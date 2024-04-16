import { Widget } from "alem";
import { Col1, Col2, Container, TeamMemberAccountId, TeamMemberItem, TeamMembersContainer, Title } from "./styles";
import hrefWithParams from "../../../../utils/hrefWithParams";

type Props = {
  team: string[];
};

const Team = ({ team: _team }: Props) => {
  const team = _team.filter((item) => item.length > 3);

  const ProfileImg = ({ teamMember }: { teamMember: string }) => (
    <Widget
      src="mob.near/widget/ProfileImage"
      props={{
        accountId: teamMember,
        imageClassName: "",
        style: {},
        thumbnail: false,
        tooltip: true,
      }}
    />
  );

  return (
    <Container>
      <Col1>
        <Title>Team members</Title>
      </Col1>
      <Col2>
        <TeamMembersContainer>
          {!team.length ? (
            <div>No team members to display</div>
          ) : (
            team.map((teamMember) => {
              if (teamMember.match(/.near/i).length > 0) {
                return (
                  <TeamMemberItem href={hrefWithParams(`?tab=profile&accountId=${teamMember}`)} target="_blank">
                    <ProfileImg teamMember={teamMember} />
                    <TeamMemberAccountId>@{teamMember}</TeamMemberAccountId>
                  </TeamMemberItem>
                );
              }
            })
          )}
        </TeamMembersContainer>
      </Col2>
    </Container>
  );
};

export default Team;
