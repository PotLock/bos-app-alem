import { useCache, useMemo, useState } from "alem";
import calcNetDonationAmount from "@app/utils/calcNetDonationAmount";
import filterByDate from "@app/utils/filterByDate";
import PotFactorySDK from "@app/SDK/potfactory";
import PotSDK from "@app/SDK/pot";
import DonateSDK from "@app/SDK/donate";
import DonorsCards from "./components/DonorsCards/DonorsCards";
import Dropdown from "@app/components/Inputs/Dropdown/Dropdown";
import DonorsTrx from "./components/DonorsTrx/DonorsTrx";
import DonorsLeaderboard from "./components/DonorsLeaderboard/DonorsLeaderboard";
import { Container, Filter, LoadingWrapper, Tabs } from "./styles";

const Leaderboard = () => {
  const Loading = () => <LoadingWrapper>Loading...</LoadingWrapper>;

  const [currentTab, setTab] = useState("leaderboard");
  const [title, setTitle] = useState<any>("");
  const [filter, setFilter] = useState("");
  const [allDonationsFetched, setAllDonationsFetched] = useState(false);
  const [fetchDonationsError, setFetchDonationsError] = useState("");

  const direct_donations_count = useMemo(() => {
    const data = DonateSDK.getConfig();
    return data.total_donations_count;
  }, []);

  const getSponsorshipDonations = (potId: string) => PotSDK.asyncGetMatchingPoolDonations(potId);

  // Get Sponsorship Donations
  const allSponsors = useCache(() => {
    return PotFactorySDK.asyncGetPots()
      .then((pots: any) => {
        if (pots) {
          const sponsors = pots.map(({ id }: any) => getSponsorshipDonations(id));
          return Promise.all(sponsors).then((allSponsors) => {
            const sumUpSponsors = allSponsors.flat().reduce((accumulator: any, currentDonation: any) => {
              accumulator[currentDonation.donor_id] = {
                amount: (accumulator[currentDonation.donor_id].amount || 0) + calcNetDonationAmount(currentDonation),
                ...currentDonation,
              };
              return accumulator;
            }, {});

            return Object.values(sumUpSponsors);
          });
        } else return [];
      })
      .catch((err: any) => {
        console.log("error fetching pots ", err);

        return [];
      });
  }, "sponsors-funding");

  // filter Sponsorship Donations by time
  const sponsors = useMemo(() => {
    if (allSponsors) {
      let sponsors = allSponsors.filter((donation: any) => filterByDate(filter, donation));
      sponsors = allSponsors.sort((a: any, b: any) => b.amount - a.amount);
      return sponsors;
    }
  }, [allSponsors, filter]);

  // Get Direct Donations
  const allDonationsPaginated = useCache(() => {
    const limit = 900; // number of donations to fetch per req

    const paginations = [...Array(Math.ceil(direct_donations_count / limit)).keys()];

    try {
      const allDonations = paginations.map((index) => DonateSDK.asyncGetDonations(limit * index, limit));

      return Promise.all(allDonations);
    } catch (error: any) {
      console.error(`error getting direct donations`, error);
      setFetchDonationsError(error);
      return Promise.all([]);
    }
  }, "direct-donations");

  //   Filter direct donations by time filter
  const [allDonations, sortedDonations] = useMemo(() => {
    if (allDonationsPaginated) {
      let donations = allDonationsPaginated.flat();
      donations = donations.filter((donation: any) => filterByDate(filter, donation));
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
  }, [allDonationsPaginated, filter]);

  const filterOptions = [
    { text: "All Time", value: "all" },
    { text: "1Y", value: "year" },
    { text: "1M", value: "month" },
    { text: "1W", value: "week" },
    { text: "24H", value: "day" },
  ];

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
      count: sponsors.length,
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
      {fetchDonationsError ? (
        <div>
          <h1>Error fetching donations</h1>
          <p>{fetchDonationsError}</p>
        </div>
      ) : !allDonationsFetched ? (
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
