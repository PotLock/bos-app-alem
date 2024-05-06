import { useState, useEffect, Big } from "alem";
import PotSDK from "@app/SDK/pot";
import PotFactorySDK from "@app/SDK/potfactory";
import FilterDropdown from "@app/components/Inputs/FilterDropdown/FilterDropdown";
import PotCard from "@app/components/PotCard/PotCard";
import { Pot, PotDetail } from "@app/types";
import ListSection from "../Projects/components/ListSection";
import Banner from "./Components/Banner";
import { sortOptions, filterBy, filters, potsSort } from "./FilterOptions";
import { Line, Container, Title } from "./styles";

const PotsHome = () => {
  const [pots, setPots] = useState(null);
  const [inProgressRounds, setInProgressRounds] = useState([]);
  const [filteredRounds, setFilteredRounds] = useState([]);
  const [completedRounds, setCompletedRounds] = useState([]);

  // Get all pots config
  if (!pots) {
    PotFactorySDK.asyncGetPots().then((pots: Pot[]) => {
      pots.forEach(({ id }) => {
        PotSDK.asyncGetConfig(id).then((potConfig: PotDetail) =>
          setPots((prevPot: any) => ({
            ...prevPot,
            [id]: { ...potConfig, id },
          })),
        );
      });
    });
  }

  const compareFunction = (pots: PotDetail[]) => {
    // sort pots(round status)
    const listOfPots: any = {};

    const states = Object.keys(potsSort);

    pots.forEach((pot) => {
      Object.keys(potsSort).some((type) => {
        const { check, items } = potsSort[type];
        if (check(pot)) {
          potsSort[type].items = [...items, pot];
          return true;
        }
      });
    });
    // sort pots(time left)
    const inProgressPots: any = [];

    Object.values(potsSort).forEach(({ items, time }: any) => {
      items.sort((a: any, b: any) => a[time] - b[time]);
      inProgressPots.push(...items);
    });
    return inProgressPots;
  };

  useEffect(() => {
    if (pots) {
      const potsVal = Object.values(pots);
      const completed: any = [];
      let inprogress: any = [];
      potsVal.forEach((round: any) => {
        if (filters.completed(round)) {
          completed.push(round);
        } else {
          inprogress.push(round);
        }
      });
      inprogress = compareFunction(inprogress);
      setFilteredRounds(inprogress);
      setInProgressRounds(inprogress);
      setCompletedRounds(completed);
    }
  }, [pots]);

  const handleFilter = (selected: any) => {
    const selectedList: any = Object.values(selected)[0];
    if (selectedList.length === 0) {
      return setFilteredRounds(inProgressRounds);
    }

    const filteredRounds = [...inProgressRounds].filter((round) =>
      selectedList.some((key: any) => {
        return filters[key](round) === true;
      }),
    );

    setFilteredRounds(filteredRounds);
  };

  const handleSort = ({ val }: any) => {
    const sortedRounds = filteredRounds;
    switch (val) {
      case "least_pots":
        sortedRounds.sort((a: PotDetail, b: PotDetail) => Big(b.matching_pool_balance) - Big(a.matching_pool_balance));
        break;
      case "most_pots":
        sortedRounds.sort((a: PotDetail, b: PotDetail) => Big(a.matching_pool_balance) - Big(b.matching_pool_balance));
        break;
      case "most_donations":
        sortedRounds.sort(
          (a: PotDetail, b: PotDetail) => Big(b.total_public_donations) - Big(a.total_public_donations),
        );
        break;
      case "least_donations":
        sortedRounds.sort(
          (a: PotDetail, b: PotDetail) => Big(a.total_public_donations) - Big(b.total_public_donations),
        );
        break;
    }

    setFilteredRounds(sortedRounds);
  };

  return (
    <Container>
      <Banner />
      <div className="content">
        <div className="header">
          <Title
            style={{
              marginRight: "auto",
              marginBottom: 0,
            }}
          >
            Active Pots <span>{filteredRounds.length}</span>
          </Title>
          <div className="filters">
            <FilterDropdown options={filterBy} onClick={handleFilter} multipleOptions={true} />
            <FilterDropdown
              options={sortOptions}
              onClick={handleSort}
              label="Sort"
              menuClass="sort"
              labelIcon="right"
            />
          </div>
        </div>

        {filteredRounds.length === 0 && <div>No pots</div>}

        <ListSection
          items={filteredRounds}
          renderItem={(pot: any) => <PotCard potId={pot.id} key={pot.id} />}
          maxCols={3}
          responsive={[
            {
              breakpoint: 1114,
              items: 2,
            },
            {
              breakpoint: 768,
              items: 1,
            },
          ]}
        />

        <Line />
        <Title>
          Completed Pots <span>{completedRounds.length}</span>
        </Title>

        <ListSection
          items={completedRounds}
          renderItem={(pot: any) => <PotCard potId={pot.id} key={pot.id} />}
          maxCols={3}
          responsive={[
            {
              breakpoint: 1114,
              items: 2,
            },
            {
              breakpoint: 768,
              items: 1,
            },
          ]}
        />
      </div>
    </Container>
  );
};

export default PotsHome;
