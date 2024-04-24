import { Project } from "@app/types";
import ListSection from "../ListSection";
import { ProjectsContainer, FilterWrapper, Title, Container, Header } from "./styles";
import Card from "@app/components/Card/Card";
import getTeamMembersFromSocialProfileData from "@app/utils/getTeamMembersFromSocialProfileData";
import RegistrySDK from "@app/SDK/registry";
import DonateSDK from "@app/SDK/donate";
import yoctosToUsd from "@app/utils/yoctosToUsd";
import getTagsFromSocialProfileData from "@app/utils/getTagsFromSocialProfileData";
import { Social, context, createDebounce, useEffect, useState } from "alem";
import SearchBar from "../SearchBar/SearchBar";
import FilterDropdown from "@app/components/Inputs/FilterDropdown/FilterDropdown";
import tagsList from "./tagsList";

const AllProjects = ({ projectsData }: { projectsData: any }) => {
  const isRegistryAdmin = RegistrySDK.isRegistryAdmin(context.accountId);

  const [totalDonation, setTotalDonation] = useState(0);
  const [totalDonated, setTotalDonated] = useState("0");
  const [projects, setProjects] = useState<any>([]);
  const [filteredProjects, setFilteredProjects] = useState<any>([]);
  const [sort, setSort] = useState("Sort");

  useEffect(() => {
    if (projects.length === 0) {
      const { allProjects } = projectsData;
      const approvedProjects = allProjects.filter((project: any) => project.status === "Approved");

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
        setFilteredProjects(filteredProjects);
        break;
      case "Newest to Oldest":
        sortNewToOld(filteredProjects);
        break;
      case "Oldest to Newest":
        sortOldToNew(filteredProjects);
        break;
      case "Most to Least Donations":
        sortHighestToLowest(filteredProjects);
        break;
      case "Least to Most Donations":
        sortLowestToHighest(filteredProjects);
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
            shouldShuffle={!isRegistryAdmin}
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
