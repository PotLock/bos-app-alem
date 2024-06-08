import { useEffect, useMemo, useState } from "alem";
import Dropdown from "@app/components/Inputs/Dropdown/Dropdown";
import calcNetDonationAmount from "@app/utils/calcNetDonationAmount";
import filterByDate from "@app/utils/filterByDate";
import DonorsCards from "./components/DonorsCards/DonorsCards";
import DonorsLeaderboard from "./components/DonorsLeaderboard/DonorsLeaderboard";
import DonorsTrx from "./components/DonorsTrx/DonorsTrx";
import { Container, Filter, LoadingWrapper, Tabs } from "./styles";
import { filterOptions, getDirectDoonations, getSponsors } from "./utils";

const Leaderboard = () => {
  const Loading = () => <LoadingWrapper>Loading...</LoadingWrapper>;

  const [currentTab, setTab] = useState("leaderboard");
  const [title, setTitle] = useState<any>("");
  const [filter, setFilter] = useState("");
  const [allDonationsFetched, setAllDonationsFetched] = useState(false);
  const [directDonations, setDirectDonations] = useState<null | []>(null);
  const [allSponsors, setAllSponsors] = useState<null | []>(null);

  useEffect(() => {
    if (!directDonations) getDirectDoonations(setDirectDonations);
    if (!allSponsors) getSponsors(setAllSponsors);
  }, []);

  const sponsors = useMemo(() => {
    if (allSponsors) {
      let sponsors = allSponsors.filter((donation: any) => filterByDate(filter, donation));

      sponsors = sponsors.reduce((accumulator: any, currentDonation: any) => {
        accumulator[currentDonation.donor_id] = {
          amount: (accumulator[currentDonation.donor_id].amount || 0) + calcNetDonationAmount(currentDonation),
          ...currentDonation,
        };
        return accumulator;
      }, {});

      return Object.values(sponsors).sort((a: any, b: any) => b.amount - a.amount);
    }
  }, [allSponsors, filter]);

  //   Filter direct donations by time filter
  const [allDonations, sortedDonations] = useMemo(() => {
    if (directDonations) {
      const donations = directDonations.filter((donation: any) => filterByDate(filter, donation));
      const totalsByDonor: any = donations.reduce((accumulator: any, currentDonation: any) => {
        accumulator[currentDonation.donor_id] = {
          amount:
            (accumulator[currentDonation.donor_id].amount || 0) +
            (currentDonation.ft_id === "near" ? calcNetDonationAmount(currentDonation) : 0),
          ...currentDonation,
        };
        return accumulator;
      }, {});
      const sortedDonations: any = Object.values(totalsByDonor).sort((a: any, b: any) => b.amount - a.amount);
      setAllDonationsFetched(true);
      return [donations, sortedDonations];
    } else {
      return [[], []];
    }
  }, [directDonations, filter]);

  const MenuItem = ({ count, children, className }: any) => (
    <div className={`menu-item ${className || ""}`}>
      <div className="label">{children}</div>
      <div className="count">{count}</div>
    </div>
  );

  const tabs = [
    {
      label: "Donor Leaderboard",
      val: "leaderboard",
      count: sortedDonations.length,
    },
    {
      label: "Sponsors Leaderboard",
      val: "sponsors",
      count: sponsors?.length || 0,
    },
    {
      label: "Donor Feed",
      val: "feed",
      count: allDonations.length,
    },
  ];

  const options: any = [
    { tab: "feed", src: (compProps: any) => <DonorsTrx {...compProps} /> },
    { tab: "sponsors", src: (compProps: any) => <DonorsLeaderboard {...compProps} /> },
  ];

  const SelectedNavComponent = options.find((option: any) => option.tab == currentTab).src;

  const sortList: any = tabs.map((tab) => ({
    label: (
      <MenuItem key={tab.val} count={tab.count}>
        {tab.label}
      </MenuItem>
    ),
    val: tab,
  }));

  return (
    <Container>
      {!allDonationsFetched ? (
        <Loading />
      ) : (
        <>
          <div className="leaderboard">
            <h1>Donors Leaderboard</h1>
            <DonorsCards {...{ sponsors, sortedDonations, currentTab }} />
          </div>
          <Tabs>
            <Dropdown
              {...{
                sortVal: title,
                title: (
                  <MenuItem className="selected" count={tabs[0].count}>
                    {tabs[0].val}{" "}
                  </MenuItem>
                ),
                sortList: sortList,
                FilterMenuCustomClass: `filter-menu`,
                handleSortChange: ({ val: option }) => {
                  setTitle(
                    <MenuItem className="selected" count={option.count}>
                      {option.val}
                    </MenuItem>,
                  );
                  setTab(option.val);
                },
              }}
            />

            <Filter>
              {filterOptions.map((option) => (
                <div
                  className={`option ${filter === option.value ? "active" : ""}`}
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                >
                  {option.text}
                </div>
              ))}
            </Filter>
          </Tabs>

          {currentTab === "leaderboard" ? (
            <DonorsLeaderboard {...{ allDonations: allDonations, filter, sponsors, sortedDonations, currentTab }} />
          ) : (
            <SelectedNavComponent
              {...{
                allDonations: allDonations,
                filter,
                sponsors,
                sortedDonations,
                currentTab,
              }}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default Leaderboard;
