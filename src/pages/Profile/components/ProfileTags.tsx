import styled from "styled-components";
import getTagsFromSocialProfileData from "../../../utils/getTagsFromSocialProfileData";
import { Social } from "alem";

type Props = {
  projectId: string;
};

const ProfileTags = ({ projectId }: Props) => {
  // const Tags = ({ projectId }: Props) => {
  const TagsContainer = styled.div`
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    max-width: 600px;
  `;

  const Tag = styled.span`
    color: #292929;
    font-size: 14px;
    font-weight: 500;
    padding: 4px 6px;
    border-radius: 2px;
    background: #ebebeb;
    box-shadow: 0px -1px 0px 0px #dbdbdb inset, 0px 0px 0px 0.5px #dbdbdb;
  `;

  const profile = Social.getr(`${projectId}/profile`);

  const tags = getTagsFromSocialProfileData(profile) as string[];
  if (!tags.length) return "No tags";

  return (
    <TagsContainer>
      {projectId && projectId.endsWith(".sputnik-dao.near") && <Tag>DAO</Tag>}
      {tags.map((tag, tagIndex) => (
        <Tag key={tagIndex}>{tag}</Tag>
      ))}
    </TagsContainer>
  );
};
export default ProfileTags;
