import { useState, Social, context, useParams, createDebounce, useEffect, Storage, promisify } from "alem";
import Card from "@app/components/Card/Card";
import { getPotDonations } from "@app/pages/Donor/NavPages/Donations/utils";
import { getConfig, getDonations, getFlaggedAccounts, getPayout, getPotProjects } from "@app/services/getPotData";
import { FlaggedAddress, Payout, PotApplication, PotDetail, PotDonation } from "@app/types";
import getTagsFromSocialProfileData from "@app/utils/getTagsFromSocialProfileData";
import getTeamMembersFromSocialProfileData from "@app/utils/getTeamMembersFromSocialProfileData";
import { Centralized, Container, SearchBar, Title, ProjectsWrapper } from "./styles";

type Props = {
  potDetail: any;
  allDonations: any;
};

type ProjectsState = {
  potDetail: PotDetail | null;
  donations: PotDonation[] | null;
  filteredProjects: PotApplication[];
  projects: PotApplication[] | null;
  flaggedAddresses: FlaggedAddress[] | null;
  payouts: Record<string, Payout> | null;
};

const Projects = (props: Props) => {
  const { potId } = useParams();

  const [state, setState] = useState<ProjectsState>({
    filteredProjects: [],
    donations: null,
    projects: null,
    flaggedAddresses: null,
    payouts: null,
    potDetail: null,
  });

  // const [projects, setProjects] = useState<PotApplication[] | null>(null);
  // const [filteredProjects, setFilteredProjects] = useState<PotDonation[]>([]);
  // const [donations, setDonations] = useState<PotDonation[] | null>(null);
  // const [flaggedAddresses, setFlaggedAddresses] = useState<FlaggedAddress[] | null>(null);
  // const [payouts, setPayouts] = useState<Record<string, Payout> | null>(null);
  // const [potDetail, setPotDetail] = useState<PotDetail | null>(null);

  const updateState = (newValue: Partial<ProjectsState>) => {
    setState((prevState) => ({ ...prevState, ...newValue }));
  };

  const { filteredProjects, flaggedAddresses, payouts, projects, potDetail, donations } = state;

  const Loading = () => (
    <Centralized>
      <div className="spinner-border text-secondary" role="status" />
    </Centralized>
  );

  // get projects
  useEffect(() => {
    if (!projects)
      getPotProjects({
        potId,
        updateState,
        isApprpved: true,
      });
    if (!potDetail)
      getConfig({
        potId,
        updateState,
      });
  }, []);

  useEffect(() => {
    if (potDetail) {
      if (!flaggedAddresses)
        getFlaggedAccounts({
          potId,
          potDetail,
          type: "list",
          updateState,
        });
      if (!donations)
        getDonations({
          potId,
          potDetail,
          updateState,
        });
    }
  }, [potDetail]);

  useEffect(() => {
    if (potDetail && flaggedAddresses && donations)
      getPayout({ allDonations: donations, flaggedAddresses, potDetail, potId, updateState });
  }, [potDetail, flaggedAddresses, donations]);

  if (!projects || !potDetail) return <Loading />;

  const { public_round_start_ms, public_round_end_ms } = potDetail;

  const now = Date.now();
  const publicRoundOpen = now >= public_round_start_ms && now < public_round_end_ms;

  const searchByWords = (searchTerm: string) => {
    if (projects.length) {
      searchTerm = searchTerm.toLowerCase().trim();
      const updatedProjects = projects.filter((project: any) => {
        const profile: any = Social.getr(`${project.project_id}/profile`);
        const fields = [
          project.project_id,
          project.status,
          profile.description,
          profile.name,
          getTagsFromSocialProfileData(profile).join(" "),
          getTeamMembersFromSocialProfileData(profile).join(" "),
        ];
        return fields.some((item) => (item || "").toLowerCase().includes(searchTerm.toLowerCase()));
      });
      updateState({
        filteredProjects: updatedProjects,
      });
    }
  };

  const onSearchChange = createDebounce((searchTerm: any) => searchByWords(searchTerm), 1000);

  return (
    <Container>
      <Title>
        <div>Projects</div>
        <div>{filteredProjects?.length}</div>
      </Title>

      <SearchBar>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.81641 8.69141H9.22391L9.01391 8.48891C9.74891 7.63391 10.1914 6.52391 10.1914 5.31641C10.1914 2.62391 8.00891 0.441406 5.31641 0.441406C2.62391 0.441406 0.441406 2.62391 0.441406 5.31641C0.441406 8.00891 2.62391 10.1914 5.31641 10.1914C6.52391 10.1914 7.63391 9.74891 8.48891 9.01391L8.69141 9.22391V9.81641L12.4414 13.5589L13.5589 12.4414L9.81641 8.69141ZM5.31641 8.69141C3.44891 8.69141 1.94141 7.18391 1.94141 5.31641C1.94141 3.44891 3.44891 1.94141 5.31641 1.94141C7.18391 1.94141 8.69141 3.44891 8.69141 5.31641C8.69141 7.18391 7.18391 8.69141 5.31641 8.69141Z"
            fill="#7B7B7B"
          />
        </svg>
        <input
          type="text"
          placeholder="Search projects"
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </SearchBar>
      {filteredProjects.length > 0 ? (
        <ProjectsWrapper>
          {filteredProjects.map((project: PotApplication) => (
            <Card
              {...{
                potId,
                projectId: project.project_id,
                allowDonate: publicRoundOpen && project.project_id !== context.accountId,
                payoutDetails: payouts
                  ? payouts[project.project_id]
                  : {
                      donorCount: 0,
                      matchingAmount: "0",
                      totalAmount: "0",
                    },
              }}
            />
          ))}
        </ProjectsWrapper>
      ) : (
        <div>No projects</div>
      )}
    </Container>
  );
};

export default Projects;
