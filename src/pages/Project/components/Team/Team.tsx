import ProfileImage from "@app/components/mob.near/ProfileImage";
import hrefWithParams from "@app/utils/hrefWithParams";
import { Col1, Col2, Container, TeamMemberAccountId, TeamMemberItem, TeamMembersContainer, Title } from "./styles";

type Props = {
  team: string[];
};

const Team = (props: Props) => {
  let { team } = props;
  team = team.filter((item) => item.length > 3);

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
            <TeamMembersContainer>
              {!team.length ? (
                <div>No team members to display</div>
              ) : (
                team.map((teamMember) => {
                  const match = teamMember.match(/.near/i);
                  if (match && match.length > 0) {
                    return (
                      <TeamMemberItem href={hrefWithParams(`?tab=profile&accountId=${teamMember}`)} target="_blank">
                        <ProfileImage
                          {...{
                            accountId: teamMember,
                            imageClassName: "",
                            style: {},
                            thumbnail: false,
                            tooltip: true,
                          }}
                        />
                        <TeamMemberAccountId>@{teamMember}</TeamMemberAccountId>
                      </TeamMemberItem>
                    );
                  }
                })
              )}
            </TeamMembersContainer>
          )}
        </TeamMembersContainer>
      </Col2>
    </Container>
  );
};

export default Team;
