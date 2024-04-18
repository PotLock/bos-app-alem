import { Social, context, useParams } from "alem";
import { Wrapper } from "./styles";
import Body from "../Profile/components/Body/Body";
import donorOptions from "./utils/donorOptions";

const DonorPage = () => {
  const { accountId: _accountId, nav } = useParams();
  const accountId = _accountId || context.accountId;

  const profile = Social.getr(`${accountId}/profile`);

  return (
    <Wrapper>
      <Body
        nav={nav ?? "feed"}
        navOptions={donorOptions(accountId)}
        profile={profile}
        //    profile,
        //    accounts: [accountId],
        //    donations: allDonations,
        //    totalDonationAmountNear,
        //    matchingRoundDonations,
        //    sponsorships,
        //    directDonations,
        //    nav: props.nav ?? "donations",
        //    navOptions: ProfileOptions(props),
        //    post: accountId === context.accountId,
      />
    </Wrapper>
  );
};

export default DonorPage;
