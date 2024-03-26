import { Dispatch, SetStateAction, Social } from "alem";
import getTagsFromSocialProfileData from "../../../../utils/getTagsFromSocialProfileData";
import { Tag, TagsWrapper } from "./styles";
import { Project } from "../../../../types";

type Props = {
  tagsList: {
    label: string;
    selected: boolean;
  }[];
  setFilteredProjects: Dispatch<SetStateAction<Project[]>>;
  setTagsList: Dispatch<
    SetStateAction<
      {
        label: string;
        selected: boolean;
      }[]
    >
  >;
  projects: Project[];
};

const Tags = ({ tagsList, setFilteredProjects, setTagsList, projects }: Props) => {
  const handleTag = (key: string) => {
    //console.log(tagsList[key].value);
    const tags = tagsList;
    tags[key].selected = !tagsList[key].selected;
    const dataArr: Project[] = projects;
    let tagSelected: string[] = [];
    tagsList.forEach((tag) => {
      if (tag.selected) {
        tagSelected.push(tag.label);
      }
    });
    let projectFilterBySearch: any[] = [];
    dataArr.forEach((item) => {
      const data = Social.getr(`${item.id}/profile`);
      const tagsForProfile = getTagsFromSocialProfileData(data);
      tagSelected.forEach((tag) => {
        if (tagsForProfile.includes(tag)) {
          projectFilterBySearch.push(item);
        }
      });
    });
    if (tagSelected.length == 0) {
      setFilteredProjects(dataArr);
    } else {
      setFilteredProjects(projectFilterBySearch);
    }
    setTagsList(tags);
  };

  return (
    <TagsWrapper>
      Tags:
      {tagsList.map((tag, key) => (
        <Tag
          key={key}
          onClick={() => handleTag(key)}
          className={`${
            tag.selected && "gap-2 bg-[#FEF6EE]"
          } p-2 rounded border text-sm flex items-center  cursor-pointer`}
        >
          {tag.selected && (
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.86204 7.58116L1.08204 4.80117L0.135376 5.74116L3.86204 9.46783L11.862 1.46783L10.922 0.527832L3.86204 7.58116Z"
                fill="#F4B37D"
              ></path>
            </svg>
          )}
          {tag.label}
        </Tag>
      ))}
    </TagsWrapper>
  );
};

export default Tags;
