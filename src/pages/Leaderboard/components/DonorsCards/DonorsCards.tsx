import { Social } from "alem";
import Image from "@app/components/mob.near/Image";
import _address from "@app/utils/_address";
import hrefWithParams from "@app/utils/hrefWithParams";
import nearToUsdWithFallback from "@app/utils/nearToUsdWithFallback";
import { Container } from "./styles";

const DonorsCards = (props: { currentTab: string; sortedDonations: any; sponsors: any }) => {
  const { sponsors, sortedDonations, currentTab } = props;

  const donations = currentTab === "sponsors" ? sponsors : sortedDonations;

  const Card = ({ donor }: any) => {
    const { id, rank, className, amount } = donor;

    const profile: any = Social.getr(`${id}/profile`);

    return (
      <div className={className || ""}>
        <Container>
          {profile === null ? (
            <div className="spinner-border text-secondary" role="status" />
          ) : (
            <>
              <Image
                {...{
                  image: profile.backgroundImage,
                  className: "background",
                  alt: profile.name,
                  fallbackUrl:
                    "https://ipfs.near.social/ipfs/bafkreidla73cknxbeovrhgb2blax2j2qgcgcn6ibluzza3buq2mbkoqs2e",
                }}
              />

              <div className="tag">{rank}</div>
              <Image
                {...{
                  image: profile.image,
                  className: "profile",
                  alt: profile.name,
                  style: {},
                  fallbackUrl:
                    "https://ipfs.near.social/ipfs/bafkreiccpup6f2kihv7bhlkfi4omttbjpawnsns667gti7jbhqvdnj4vsm",
                }}
              />

              <a href={hrefWithParams(`?tab=profile&accountId=${id}`)} className="name" target="_blank">
                {_address(profile.name ? profile.name : id)}
              </a>
              <div className="description">{profile.description ? _address(profile.description, 20) : "-"}</div>
              <div className="amount">{nearToUsdWithFallback(amount)} Donated</div>
            </>
          )}
        </Container>
      </div>
    );
  };

  const leaderboard = [
    {
      rank: "#2",
      id: donations[1].donor_id,
      amount: donations[1].amount,
    },
    {
      rank: (
        <img
          src="https://ipfs.near.social/ipfs/bafkreicjk6oy6465ps32owoomppfkvimbjlnhbaldvf6ujuyhkjas6ghjq"
          alt="top"
        />
      ),
      id: donations[0].donor_id,
      className: "top",
      amount: donations[0].amount,
    },
    {
      rank: "#3",
      id: donations[2].donor_id,
      amount: donations[2].amount,
    },
  ];

  return (
    <div className="cards">{leaderboard.map((donor) => (donor.id ? <Card key={donor.id} donor={donor} /> : ""))}</div>
  );
};

export default DonorsCards;
