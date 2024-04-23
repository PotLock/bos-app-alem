import { PotDetail } from "@app/types";
import constants from "@app/constants";
import _address from "@app/utils/_address";
import getTimePassed from "@app/utils/getTimePassed";
import { State, state, useEffect, useParams } from "alem";
import { Container, DonationsCount, OuterText, OuterTextContainer, Sort, TableContainer } from "./styes";
import Arrow from "@app/assets/svgs/Arrow";
import DonationsTable from "../../components/DonationsTable/DonationsTable";

type Props = {
  allDonations: any[];
  potDetail: PotDetail;
};

const Donations = (props: Props) => {
  const { allDonations, potDetail } = props;

  State.init({
    filteredDonations: [],
    currentFilter: "date",
    filter: {
      date: false, // false === ascending
      price: false, // false === ascending
    },
  });

  const { filteredDonations, currentFilter, filter } = state;

  useEffect(() => {
    if (allDonations && filteredDonations.length === 0) {
      const sortedDonations = [...allDonations].reverse();
      State.update({ filteredDonations: sortedDonations });
    }
  }, [allDonations]);
  if (!allDonations) return <div className="spinner-border text-secondary" role="status" />;

  const searchDonations = (searchTerm: string) => {
    // filter donations that match the search term (donor_id, project_id)
    const filteredDonations = allDonations.filter((donation) => {
      const { donor_id, project_id } = donation;
      const searchFields = [donor_id, project_id];

      return searchFields.some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()));
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
