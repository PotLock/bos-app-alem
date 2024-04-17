import { Social, context, createDebounce, props, useEffect, useState } from "alem";
import {
  FilterButton,
  FilterIcon,
  FilterItem,
  FilterMenu,
  Header,
  Row,
  SearchBarContainer,
  SearchBarInput,
  SearchIcon,
  Title,
} from "./styles";
import DonateSDK from "@app/SDK/donate";
import yoctosToUsd from "@app/utils/yoctosToUsd";
import getTagsFromSocialProfileData from "@app/utils/getTagsFromSocialProfileData";
import Tags from "../Tags/Tags";
import AllProjects from "../AllProjects/AllProjects";
import { Project } from "@app/types";
import getTeamMembersFromSocialProfileData from "@app/utils/getTeamMembersFromSocialProfileData";
import getProjects from "@app/services/getProjects";
import RegistrySDK from "@app/SDK/registry";

const SearchBar = () => {
  const isRegistryAdmin = RegistrySDK.isRegistryAdmin(context.accountId);

  const [totalDonation, setTotalDonation] = useState(0);
  const [totalDonated, setTotalDonated] = useState("0");
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [sort, setSort] = useState("Sort");

  const projectsData = getProjects();
  useEffect(() => {
    if (projects.length === 0) {
      const { allProjects } = projectsData;
      setProjects(allProjects);
      setFilteredProjects(allProjects);
    }
  }, [projectsData]);

  if (!projects) {
    return "";
  }

  const [tagsList, setTagsList] = useState([
    {
      label: "Desci",
      selected: false,
    },
    {
      label: "Open Source",
      selected: false,
    },
    {
      label: "Non Profit",
      selected: false,
    },
    {
      label: "Social Impact",
      selected: false,
    },
    {
      label: "Climate",
      selected: false,
    },
    {
      label: "Public Good",
      selected: false,
    },
    {
      label: "Community",
      selected: false,
    },
    {
      label: "Education",
      selected: false,
    },
  ]);

  useEffect(() => {
    if (filteredProjects.length < 1) {
      setFilteredProjects(projects);
    }
  }, [projects]);

  // console.log("filter", filteredProjects);

  const donateConfig = DonateSDK.getConfig();
  if (donateConfig && !totalDonated && !totalDonation) {
    const lastDonationAmount = yoctosToUsd(donateConfig.net_donations_amount);
    setTotalDonated(lastDonationAmount);
    setTotalDonation(donateConfig.total_donations_count);
  }

  const sortHighestToLowest = (projects: Project[]) => {
    const sort = (a: any, b: any) => {
      return parseFloat(b.total) - parseFloat(a.total);
    };
    const projectLength = projects.length;

    for (let i = 0; i < projectLength - 1; i++) {
      for (let j = 0; j < projectLength - 1 - i; j++) {
        if (sort(projects[j], projects[j + 1]) > 0) {
          const temp = projects[j];
          projects[j] = projects[j + 1];
          projects[j + 1] = temp;
        }
      }
    }

    setFilteredProjects(projects);
  };

  const sortLowestToHighest = (projects: Project[]) => {
    const sort = (a: any, b: any) => {
      return parseFloat(b.total) - parseFloat(a.total);
    };
    const projectLength = projects.length;

    for (let i = 0; i < projectLength - 1; i++) {
      for (let j = 0; j < projectLength - 1 - i; j++) {
        if (sort(projects[j], projects[j + 1]) < 0) {
          const temp = projects[j];
          projects[j] = projects[j + 1];
          projects[j + 1] = temp;
        }
      }
    }

    setFilteredProjects(projects);
  };

  const sortNewToOld = (projects: Project[]) => {
    const projectLength = projects.length;

    for (let i = 0; i < projectLength - 1; i++) {
      for (let j = 0; j < projectLength - i - 1; j++) {
        if (projects[j].submitted_ms < projects[j + 1].submitted_ms) {
          const temp = projects[j];
          projects[j] = projects[j + 1];
          projects[j + 1] = temp;
        }
      }
    }
    setFilteredProjects(projects);
  };

  const sortOldToNew = (projects: Project[]) => {
    const projectLength = projects.length;

    for (let i = 0; i < projectLength - 1; i++) {
      for (let j = 0; j < projectLength - i - 1; j++) {
        if (projects[j].submitted_ms > projects[j + 1].submitted_ms) {
          const temp = projects[j];
          projects[j] = projects[j + 1];
          projects[j + 1] = temp;
        }
      }
    }
    setFilteredProjects(projects);
  };

  const handleSortChange = (sortType: string) => {
    setSort(sortType);
    switch (sortType) {
      case "All":
        setFilteredProjects(projects);
        break;
      case "Newest to Oldest":
        sortNewToOld(projects);
        break;
      case "Oldest to Newest":
        sortOldToNew(projects);
        break;
      case "Most to Least Donations":
        sortHighestToLowest(projects);
        break;
      case "Least to Most Donations":
        sortLowestToHighest(projects);
        break;
    }
  };

  const searchByWords = (searchTerm: string) => {
    searchTerm = searchTerm.toLowerCase().trim();
    let results: Project[] = [];
    // const dataArr = projects;
    // let alldata = [];
    projects.forEach((project) => {
      const { id, status } = project;
      const data = Social.getr(`${id}/profile`) as any;
      // alldata.push(data);
      if (id.includes(searchTerm) || status.toLowerCase().includes(searchTerm)) {
        results.push(project);
      } else if (data) {
        if (
          data.description.toLowerCase().includes(searchTerm) ||
          data.name.toLowerCase().includes(searchTerm) ||
          getTagsFromSocialProfileData(data).join("").toLowerCase().includes(searchTerm) ||
          getTeamMembersFromSocialProfileData(data).join("").toLowerCase().includes(searchTerm)
        ) {
          results.push(project);
        }
      }
    });

    setFilteredProjects(results);
  };

  const handleTag = (key: any) => {
    //console.log(tagsList[key].value);
    const tags = tagsList;
    tags[key].selected = !tagsList[key].selected;
    const dataArr = projects;
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

  const [openFilter, setOpenFilter] = useState(false);

  // Debounced -> Search by words
  const onSearchChange = createDebounce((event: any) => searchByWords(event.target.value), 1000);

  const SORT_FILTERS = {
    ALL: "All",
    NEW_TO_OLD: "Newest to Oldest",
    OLD_TO_NEW: "Oldest to Newest",
  };

  const { tab } = props;
  const numItems = filteredProjects.length;
  const itemName = tab == "pots" ? "pot" : "project";
  const title = sort;
  const sortList = Object.values(SORT_FILTERS);

  return (
    <Header>
      <Title>
        all projects
        <span style={{ color: "#DD3345", marginLeft: "8px", fontWeight: 600 }}>{projects.length}</span>
      </Title>
      <SearchBarContainer>
        <Row>
          <SearchIcon>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.7549 14.2549H14.9649L14.6849 13.9849C15.6649 12.8449 16.2549 11.3649 16.2549 9.75488C16.2549 6.16488 13.3449 3.25488 9.75488 3.25488C6.16488 3.25488 3.25488 6.16488 3.25488 9.75488C3.25488 13.3449 6.16488 16.2549 9.75488 16.2549C11.3649 16.2549 12.8449 15.6649 13.9849 14.6849L14.2549 14.9649V15.7549L19.2549 20.7449L20.7449 19.2549L15.7549 14.2549ZM9.75488 14.2549C7.26488 14.2549 5.25488 12.2449 5.25488 9.75488C5.25488 7.26488 7.26488 5.25488 9.75488 5.25488C12.2449 5.25488 14.2549 7.26488 14.2549 9.75488C14.2549 12.2449 12.2449 14.2549 9.75488 14.2549Z"
                fill="#C7C7C7"
              />
            </svg>
          </SearchIcon>
          <SearchBarInput
            placeholder={`Search (${numItems}) ${numItems === 1 ? itemName : itemName + "s"}`}
            onChange={onSearchChange}
            type="text"
            autoComplete="search"
          />
        </Row>
        <div style={{ position: "relative" }} onClick={() => setOpenFilter(!openFilter)}>
          <FilterButton>
            {title}
            <FilterIcon>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8 3.88667L10.1133 6L11.0533 5.06L8 2L4.94 5.06L5.88667 6L8 3.88667ZM8 12.1133L5.88667 10L4.94667 10.94L8 14L11.06 10.94L10.1133 10L8 12.1133Z"
                  fill="#7B7B7B"
                />
              </svg>
            </FilterIcon>
          </FilterButton>
          {openFilter && (
            <FilterMenu onClick={(e) => e.stopPropagation()}>
              {sortList.map((filter: any, key: number) => (
                <FilterItem
                  key={key}
                  onClick={() => {
                    setOpenFilter(false);
                    handleSortChange(filter);
                  }}
                >
                  {filter}
                </FilterItem>
              ))}
            </FilterMenu>
          )}
        </div>
      </SearchBarContainer>
      <Tags
        tagsList={tagsList}
        projects={projects}
        setFilteredProjects={setFilteredProjects}
        setTagsList={setTagsList}
      />
      <AllProjects filteredProjects={filteredProjects} isRegistryAdmin={isRegistryAdmin} />
    </Header>
  );
};

export default SearchBar;
