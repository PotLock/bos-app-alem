import { State, state, useEffect, useParams } from "alem";
import Arrow from "@app/assets/svgs/Arrow";
import { getConfig, getDonations } from "@app/services/getPotData";
import { PotDetail, PotDonation } from "@app/types";
import _address from "@app/utils/_address";
import DonationsTable from "../../components/DonationsTable/DonationsTable";
import { Container, DonationsCount, OuterText, OuterTextContainer, Sort } from "./styes";

const Donations = () => {
  const { potId } = useParams();

  State.init({
    potDetail: null,
    allDonations: null,
    filteredDonations: [],
    currentFilter: "date",
    filter: {
      date: false, // false === ascending
      price: false, // false === ascending
    },
  });

  const { filteredDonations, currentFilter, filter, potDetail, allDonations } = state;

  useEffect(() => {
    if (!potDetail)
      getConfig({
        potId,
        updateState: (potDetail) =>
          State.update({
            potDetail,
          }),
      });
    if (!allDonations && potDetail)
      getDonations({
        potId,
        potDetail,
        updateState: (allDonations) =>
          State.update({
            allDonations,
            filteredDonations: allDonations,
          }),
      });
  }, [potDetail]);

  if (allDonations === null && potDetail === null)
    return <div className="spinner-border text-secondary" role="status" />;

  const searchDonations = (searchTerm: string) => {
    // filter donations that match the search term (donor_id, project_id)
    const filteredDonations = allDonations.filter((donation: PotDonation) => {
      const { donor_id, project_id } = donation;
      const searchFields = [donor_id, project_id];

      return searchFields.some((field) => (field || "").toLowerCase().includes(searchTerm.toLowerCase()));
    });
    return filteredDonations;
  };

  const sortDonation = (type: string) => {
    const sort = !filter[type];
    State.update({ currentFilter: type, filter: { ...filter, [type]: sort } });
    if (type === "price") {
      const sortedDonations = filteredDonations.sort((a: any, b: any) =>
        sort ? b.total_amount - a.total_amount : a.total_amount - b.total_amount,
      );
      State.update({ filteredDonations: sortedDonations });
    } else if (type === "date") {
      const sortedDonations = filteredDonations.sort((a: any, b: any) => {
        return sort ? b.donated_at - a.donated_at : a.donated_at - b.donated_at;
      });
      State.update({ filteredDonations: sortedDonations });
    }
  };

  const handleSearch = ({ target: { value } }: any) => {
    const filteredDonations = searchDonations(value);
    State.update({ filteredDonations });
  };

  return (
    <Container>
      <OuterTextContainer>
        <OuterText>All donations</OuterText>
        <DonationsCount>{allDonations.length}</DonationsCount>
      </OuterTextContainer>
      <Sort>
        <div className={`${currentFilter === "date" ? "active" : ""}`} onClick={() => sortDonation("date")}>
          Sort Date {currentFilter === "date" && <Arrow active={!filter.date} />}
        </div>
        <div onClick={() => sortDonation("price")} className={`${currentFilter === "price" ? "active" : ""}`}>
          Sort Amount {currentFilter === "price" && <Arrow active={filter.price} />}
        </div>
      </Sort>
      <DonationsTable
        {...{
          filteredDonations,
          filter,
          handleSearch,
          sortDonation,
          currentFilter,
          potDetail,
        }}
      />
    </Container>
  );
};

export default Donations;
