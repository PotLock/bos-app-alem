import { useState, useMemo, Social, context, useParams } from "alem";
import { Container, SearchBar, Title } from "./styles";
import calculatePayouts from "@app/utils/calculatePayouts";
import getTagsFromSocialProfileData from "@app/utils/getTagsFromSocialProfileData";
import getTeamMembersFromSocialProfileData from "@app/utils/getTeamMembersFromSocialProfileData";
import PotSDK from "@app/SDK/pot";
import ListSection from "@app/pages/Projects/components/ListSection";
import Card from "@app/components/Card/Card";

type Props = {
  potDetail: any;
  sybilRequirementMet: boolean;
  allDonations: any;
};

const Projects = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [projects, setProjects] = useState<any>(null);
  const [flaggedAddresses, setFlaggedAddresses] = useState(null);

  // get projects
  const { potId } = useParams();
  const { potDetail, sybilRequirementMet, allDonations } = props;

  if (!projects) {
    PotSDK.asyncGetApprovedApplications(potId).then((projects: any) => {
      setProjects(projects);
      setFilteredProjects(projects);
    });
  }

  if (!projects) return <div className="spinner-border text-secondary" role="status" />;

  const { public_round_start_ms, public_round_end_ms, referral_fee_public_round_basis_points } = potDetail;

  const now = Date.now();
  const publicRoundOpen = now >= public_round_start_ms && now < public_round_end_ms;

  if (!flaggedAddresses) {
    PotSDK.getFlaggedAccounts(potDetail, potId)
      .then((data) => {
        const listOfFlagged: any = [];
        data.forEach((adminFlaggedAcc: any) => {
          const addresses = Object.keys(adminFlaggedAcc.potFlaggedAcc);
          listOfFlagged.push(...addresses);
        });
        setFlaggedAddresses(listOfFlagged);
      })
      .catch((err) => console.log("error getting the flagged accounts ", err));
  }

  const payouts: any = useMemo(() => {
    if (allDonations.length && flaggedAddresses)
      return calculatePayouts(allDonations, potDetail.matching_pool_balance, flaggedAddresses);
  }, [allDonations, flaggedAddresses]);

  const searchByWords = (searchTerm: string) => {
    if (projects.length) {
      searchTerm = searchTerm.toLowerCase().trim();
      setSearchTerm(searchTerm);
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
      setFilteredProjects(updatedProjects);
    }
  };

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
          onChange={(e) => searchByWords(e.target.value)}
          className="search-input"
        />
      </SearchBar>
      <ListSection
        shouldShuffle={true}
        maxCols={3}
        items={filteredProjects}
        responsive={[
          {
            breakpoint: 1200,
            items: 2,
          },
          {
            breakpoint: 870,
            items: 1,
          },
        ]}
        renderItem={(project: any) => {
          return (
            <Card
              {...{
                potDetail,
                projects,
                projectId: project.project_id,
                allowDonate: sybilRequirementMet && publicRoundOpen && project.project_id !== context.accountId,
                requireVerification: !sybilRequirementMet,
                potRferralFeeBasisPoints: referral_fee_public_round_basis_points,
                payoutDetails: payouts[project.project_id] || {
                  donorCount: 0,
                  matchingAmount: "0",
                  totalAmount: "0",
                },
              }}
            />
          );
        }}
      />
    </Container>
  );
};

export default Projects;
