import hrefWithParams from "@app/utils/hrefWithParams";
import ProfileImage from "@app/components/mob.near/ProfileImage";
import { Col1, Col2, Container, TeamMemberAccountId, TeamMemberItem, TeamMembersContainer, Title } from "./styles";
import { useMemo } from "alem";

type Props = {
  team: string[];
};

const Team = (props: Props) => {
  let { team } = props;
  team = team.filter((item) => item.length > 3);

  const teamMembers = useMemo(() => {
    return (
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
                      thumbnail: "",
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
    );
  }, []);

  return (
    <Container>
      <Col1>
        <Title>Team members</Title>
      </Col1>
      <Col2>
        <TeamMembersContainer>
          {!team.length ? <div>No team members to display</div> : <>{teamMembers}</>}
        </TeamMembersContainer>
      </Col2>
    </Container>
  );
};

export default Team;
