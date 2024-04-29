import { Project } from "@app/types";
import ListSection from "../ListSection";
import { ProjectsContainer, FilterWrapper, Title, Container, Header } from "./styles";
import Card from "@app/components/Card/Card";
import getTeamMembersFromSocialProfileData from "@app/utils/getTeamMembersFromSocialProfileData";
import DonateSDK from "@app/SDK/donate";
import yoctosToUsd from "@app/utils/yoctosToUsd";
import getTagsFromSocialProfileData from "@app/utils/getTagsFromSocialProfileData";
import { Social, context, createDebounce, useEffect, useState } from "alem";
import SearchBar from "../SearchBar/SearchBar";
import FilterDropdown from "@app/components/Inputs/FilterDropdown/FilterDropdown";
import tagsList from "./tagsList";
import ListsSDK from "@app/SDK/lists";

const AllProjects = ({ projectsData }: { projectsData: any }) => {
  const isRegistryAdmin = ListsSDK.isRegistryAdmin(context.accountId);

  const [totalDonation, setTotalDonation] = useState(0);
  const [totalDonated, setTotalDonated] = useState("0");
  const [projects, setProjects] = useState<any>([]);
  const [filteredProjects, setFilteredProjects] = useState<any>([]);
  const [sort, setSort] = useState("Sort");

  useEffect(() => {
    if (projects.length === 0 && projectsData) {
      const { allProjects, approvedProjects } = projectsData;
      setProjects(allProjects);
      setFilteredProjects(approvedProjects);
    }
  }, [projectsData]);

  if (!projects) {
    return "";
  }

  const donateConfig = DonateSDK.getConfig();
  if (donateConfig && !totalDonated && !totalDonation) {
    const lastDonationAmount = yoctosToUsd(donateConfig.net_donations_amount);
    setTotalDonated(lastDonationAmount);
    setTotalDonation(donateConfig.total_donations_count);
  }

  const handleSortChange = (sortType: string) => {
    setSort(sortType);
    const projects = [...filteredProjects];
    switch (sortType) {
      case "All":
        break;
      case "Newest to Oldest":
        projects.sort((a, b) => b.submitted_ms - a.submitted_ms);
        setFilteredProjects(projects);
        break;
      case "Oldest to Newest":
        projects.sort((a, b) => a.submitted_ms - b.submitted_ms);
        setFilteredProjects(projects);
        break;
      default:
        break;
    }
  };

  const searchByWords = (searchTerm: string) => {
    searchTerm = searchTerm.toLowerCase().trim();
    let results: Project[] = [];
    projects.forEach((project: any) => {
      const { registrant_id, status }: Project = project;
      const data: any = Social.getr(`${registrant_id}/profile`);
      if (registrant_id.includes(searchTerm) || status.toLowerCase().includes(searchTerm)) {
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

  const checkAllTrue = (arr: any) => arr.every((item: boolean) => item === true);

  const filterProjects = (filters: any) =>
    projects.filter((item: any) => {
      const filterVals = Object.keys(filters).map((type) => {
        if (filters[type].length === 0) return true;

        if (type === "Category") {
          const data = Social.getr(`${item.registrant_id}/profile`);

          const tagsForProfile = getTagsFromSocialProfileData(data);

          return filters[type].some((tag: string) => tagsForProfile.includes(tag));
        }

        if (type === "Status") {
          if (filters[type].includes("all")) return true;
          return filters[type].includes(item.status);
        }
        return true;
      });
      return checkAllTrue(filterVals);
    });
  const handleTag = (selectedFilters: any) => {
    const projectFilterBySearch = filterProjects(selectedFilters);

    setFilteredProjects(projectFilterBySearch);
  };

  // Debounced -> Search by words
  const onSearchChange = createDebounce((searchTerm: any) => searchByWords(searchTerm), 1000);

  const SORT_FILTERS = {
    NEW_TO_OLD: "Newest to Oldest",
    OLD_TO_NEW: "Oldest to Newest",
  };

  return (
    <Container>
      <Header>
        <Title>
          All projects
          <span style={{ color: "#DD3345", marginLeft: "8px", fontWeight: 600 }}>{filteredProjects.length}</span>
        </Title>
        <FilterWrapper>
          <FilterDropdown
            {...{
              onClick: handleTag,
              multipleOptions: true,
              options: tagsList,
              defaultSelected: {
                Status: ["Approved"],
              },
              menuClass: "filter-menu",
            }}
          />

          <SearchBar
            {...{
              title: sort,
              numItems: filteredProjects.length,
              itemName: "project",
              sortList: Object.values(SORT_FILTERS),
              FilterMenuClass: `left-side-menu`,
              setSearchTerm: onSearchChange,
              handleSortChange: (filter) => {
                handleSortChange(filter);
              },
            }}
          />
        </FilterWrapper>
      </Header>
      <ProjectsContainer>
        {filteredProjects.length ? (
          <ListSection
            items={filteredProjects}
            renderItem={(project: Project) => <Card projectId={project.registrant_id} allowDonate={true} />}
          />
        ) : (
          <div style={{ alignSelf: "flex-start", margin: "24px 0px" }}>No results</div>
        )}
      </ProjectsContainer>
    </Container>
  );
};

export default AllProjects;
