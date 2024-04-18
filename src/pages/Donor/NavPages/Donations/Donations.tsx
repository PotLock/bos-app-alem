import { Container, DropdownLabelWrapper, FundingSrc, ImgIcon, Funding, SearchBar, Sort, Stats } from "./styles";
import { Widget, useState, useEffect, useParams, useMemo, Big } from "alem";
import Dropdown from "@app/components/Inputs/Dropdown/Dropdown";
import NearSvg from "@app/assets/svgs/near";
import DonateSDK from "@app/SDK/donate";
import PotFactorySDK from "@app/SDK/potfactory";
import PotSDK from "@app/SDK/pot";
import { PotDetail, Pot } from "@app/types";
import { getPotDonations, filterDonations, searchDonations, getName, addTrailingZeros } from "./utils";
import { SUPPORTED_FTS } from "@app/constants";
import nearToUsd from "@app/utils/nearToUsd";
import _address from "@app/utils/_address";
import PotIcon from "@app/assets/svgs/PotIcon";
import ProfileImage from "@app/components/ProfileImage";
import Pagination from "@app/components/Pagination/Pagination";
import getTimePassed from "@app/utils/getTimePassed";
import hrefWithParams from "@app/utils/hrefWithParams";
import Arrow from "@app/assets/svgs/Arrow";

const Donations = () => {
  const PER_PAGE = 30;
  const [ftMetadata, setFtMetadata] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({
    date: false, // false === ascending
    price: false, // false === ascending
  });
  const [currentFilter, setCurrentFilter] = useState("date");
  const [sort, setSort] = useState("all");
  const [search, setSearch] = useState("");

  // mapping of pot IDs to array of sponsorship (matching pool) donations to this pot for this user
  const [potDonations, setPotDonations] = useState<any>({});
  const [directDonations, setDirectDonations] = useState<any>(null);
  const [filteredDonations, setFilteredDonations] = useState<any>(null);

  const { accountId, potId } = useParams();

  // Get all Pots
  const pots = PotFactorySDK.getPots();

  // Get Direct Donations
  let donationsForDonor = DonateSDK.getDonationsForDonor(accountId);
  if (donationsForDonor && !directDonations) {
    donationsForDonor = donationsForDonor.map((donation: any) => ({
      ...donation,
      type: "direct",
    }));
    setDirectDonations(donationsForDonor);
  }
  // Get Sponsorship Donations
  if (pots && !potDonations[pots[pots.length - 1].id]) {
    pots.forEach((pot: Pot) => {
      PotSDK.asyncGetConfig(pot.id).then((potDetail: PotDetail) => {
        getPotDonations(pot.id, potDetail, accountId, potDonations, setPotDonations);
      });
    });
  }

  // Sum up all donations

  const [totalDonations, sponsorships, matchingRoundDonations] = useMemo(() => {
    const potDonationsValue = Object.values(potDonations).flat();

    const sponsorships = potDonationsValue.filter((donation: any) => donation.type === "sponsorship");
    const matchingRoundDonations = potDonationsValue.filter((donation: any) => donation.type === "matched");
    const allDonations = [...(directDonations || []), ...potDonationsValue];
    allDonations.sort((a: any, b: any) => (b.donated_at || b.donated_at_ms) - (a.donated_at || a.donated_at_ms));
    return [allDonations, sponsorships, matchingRoundDonations];
  }, [potDonations, directDonations]);

  const handleSortChange = ({ val }: any) => {
    const filtered = filterDonations(val, sortList, search, totalDonations);
    setFilteredDonations(filtered);
    setSort(val);
  };

  // Get total donations & Unique donors count
  const [totalDonationAmountNear] = useMemo(() => {
    let total = Big(0);
    totalDonations.forEach((donation: any) => {
      if (donation.ft_id === "near" || donation.base_currency === "near") {
        total = total.plus(Big(donation.total_amount || donation.amount));
      }
    });
    const totalDonationAmountNear: any = SUPPORTED_FTS.NEAR.fromIndivisible(total.toString());

    return [totalDonationAmountNear];
  }, [totalDonations]);

  useEffect(() => {
    // Fetches FT metadata (required for icons & decimals)
    const metadata: any = {};
    const ftIds: any = totalDonations.reduce((acc: any, donation: any) => {
      if (donation.ft_id && donation.ft_id !== "near") {
        acc.add(donation.ft_id);
      }
      return acc;
    }, new Set());
    ftIds.forEach((ftId: any) => {
      Near.asyncView(ftId, "ft_metadata", {})
        .then((ftMetadata: any) => {
          metadata[ftId] = ftMetadata;
          if (Object.keys(metadata).length === ftIds.size) {
            setFtMetadata(metadata);
          }
        })
        .catch((e: any) => {
          console.error("error getting ft metadata: ", e);
        });
    });
  }, [totalDonations]);

  const getDate = (donation: any) => donation.donated_at_ms || donation.donated_at;

  const sortDonation = (type: "date" | "price") => {
    setCurrentFilter(type);
    const sort = !filter[type];
    setFilter({ ...filter, [type]: sort });
    if (type === "price") {
      const sortedDonations = filteredDonations.sort((a: any, b: any) =>
        sort ? b.total_amount - a.total_amount : a.total_amount - b.total_amount,
      );
      setFilteredDonations(sortedDonations);
    } else if (type === "date") {
      const sortedDonations = filteredDonations.sort((a: any, b: any) => {
        return sort ? getDate(a) - getDate(b) : getDate(b) - getDate(a);
      });
      setFilteredDonations(sortedDonations);
    }
  };

  const sortList: any = {
    all: {
      label: "All donations",
      val: "all",
      count: totalDonations?.length,
    },
    direct: {
      label: "Direct donations",
      val: "direct",
      count: directDonations?.length,
    },
    matched: {
      label: "Matched donations",
      val: "matched",
      count: matchingRoundDonations?.length,
    },

    sponsorship: {
      label: "Sponsorships",
      val: "sponsorship",
      count: sponsorships?.length,
    },
  };

  const DropdownLabel = () => {
    const digit = sortList[sort].count.toString().length;
    return (
      <DropdownLabelWrapper
        style={{
          width: `${24 + (digit - 1) * 6}px`,
          height: `${24 + (digit - 1) * 6}px`,
        }}
      >
        <div className="label">{sortList[sort].label}</div>
        <div className="count">{sortList[sort].count}</div>
      </DropdownLabelWrapper>
    );
  };

  return (
    <Container>
      <Stats>
        {totalDonationAmountNear && (
          <div className="item">
            <div className="item-value">
              {" "}
              {totalDonationAmountNear}N{nearToUsd && <span>~${(totalDonationAmountNear * nearToUsd).toFixed(2)}</span>}
            </div>
            <div className="item-label">Donated</div>
          </div>
        )}
        <div className="dropdown">
          {/* FilterMenuCustomStyle: `left:auto; right:0;`, */}

          <Dropdown
            handleSortChange={handleSortChange}
            sortList={Object.values(sortList)}
            showCount={true}
            sortVal={<DropdownLabel />}
          />
        </div>
      </Stats>
      <Sort>
        <div onClick={() => sortDonation("date")} className={`${currentFilter === "date" ? "active" : ""}`}>
          Sort Date {currentFilter === "date" && <Arrow active={!filter.date} />}
        </div>
        <div onClick={() => sortDonation("price")} className={`${currentFilter === "price" ? "active" : ""}`}>
          Sort Amount {currentFilter === "price" && <Arrow active={filter.price} />}
        </div>
      </Sort>
      <Funding>
        <div className="header">
          <div className="funding tab">Project Name</div>
          <div className="tab sort" onClick={() => sortDonation("price")}>
            Amount {currentFilter === "price" && <Arrow active={filter.price} />}
          </div>
          <div className="tab sort date" onClick={() => sortDonation("date")}>
            Date {currentFilter === "date" && <Arrow active={!filter.date} />}
          </div>
        </div>
        <SearchBar>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15.7549 14.2549H14.9649L14.6849 13.9849C15.6649 12.8449 16.2549 11.3649 16.2549 9.75488C16.2549 6.16488 13.3449 3.25488 9.75488 3.25488C6.16488 3.25488 3.25488 6.16488 3.25488 9.75488C3.25488 13.3449 6.16488 16.2549 9.75488 16.2549C11.3649 16.2549 12.8449 15.6649 13.9849 14.6849L14.2549 14.9649V15.7549L19.2549 20.7449L20.7449 19.2549L15.7549 14.2549ZM9.75488 14.2549C7.26488 14.2549 5.25488 12.2449 5.25488 9.75488C5.25488 7.26488 7.26488 5.25488 9.75488 5.25488C12.2449 5.25488 14.2549 7.26488 14.2549 9.75488C14.2549 12.2449 12.2449 14.2549 9.75488 14.2549Z"
              fill="#C7C7C7"
            />
          </svg>
          <input
            className=""
            placeholder="Search funding"
            onChange={(e) => {
              if (currentPage !== 1) setCurrentPage(1);
              setSearch(e.target.value);
              const filtered = searchDonations(e.target.value, totalDonations);
              setFilteredDonations(filtered);
            }}
            type="text"
          />
        </SearchBar>
        {filteredDonations.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE).map((donation: any) => {
          const {
            total_amount,
            amount,
            pot_id,
            recipient_id,
            project_id,
            paid_at,
            base_currency,
            ft_id,
            type,
            donated_at,
            donated_at_ms,
          } = donation;

          const ftId = ft_id || base_currency;

          const donationAmount = parseFloat(
            Big(total_amount || amount)
              .div(Big(10).pow(ftId === "near" ? 24 : ftMetadata[ftId]?.decimals || 24))
              .toFixed(2),
          );

          const isPot = type === "sponsorship";

          const url = isPot ? `?tab=pot&potId=${pot_id}` : `?tab=project&projectId=${project_id || recipient_id}`;

          const name = _address(getName(donation), 15);

          return (
            <div className="funding-row">
              <FundingSrc>
                {isPot ? (
                  <PotIcon className="profile-image" />
                ) : (
                  <ProfileImage accountId={recipient_id || project_id} />
                )}
                <div className="funding-src">
                  <a href={hrefWithParams(url)} target="_blank">
                    {isPot && <span className="pot-name"> Sponsor :</span>} {name}
                  </a>
                  <div className="type">{sortList[type].label?.slice(0, -1)}</div>
                </div>
              </FundingSrc>
              <div className="price tab">
                <div className="near-icon">
                  {ftId === "near" ? <NearSvg /> : <ImgIcon src={ftMetadata[ftId]?.icon} />}
                </div>
                {addTrailingZeros(donationAmount)}
              </div>
              <div className="tab date">{getTimePassed(donated_at_ms || donated_at || paid_at, true)} ago</div>
            </div>
          );
        })}
        {filteredDonations.length === 0 && <div className="funding-row">No Donations</div>}
      </Funding>
      <Pagination
        data={filteredDonations}
        currentPage={currentPage}
        perPage={PER_PAGE}
        onPageChange={(page) => {
          setCurrentPage(page);
        }}
      />
    </Container>
  );
};

export default Donations;
