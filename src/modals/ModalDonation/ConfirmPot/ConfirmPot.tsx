import { Big, Near, Social, props } from "alem";
import PotSDK from "@app/SDK/pot";
import CheckBox from "@app/components/Inputs/Checkbox/Checkbox";
import ProfileImage from "@app/components/mob.near/ProfileImage";
import NearIcon from "@app/assets/svgs/near-icon";
import nearToUsd from "@app/utils/nearToUsd";
import _address from "@app/utils/_address";
import BreakdownSummary from "@app/components/Cart/BreakdownSummary/BreakdownSummary";
import Button from "@app/components/Button";
import {
  Amout,
  ButtonWrapper,
  Container,
  ContentScrollable,
  FeesRemoval,
  Label,
  ProjectAmount,
  Projects,
} from "./styles";

const ConfirmPot = ({
  selectedDenomination,
  bypassProtocolFee,
  bypassChefFee,
  updateState,
  potDetail,
  potId,
  referrerId,
  accountId,
  amount,
  openDonationSuccessModal,
  selectedProjects,
  donationType,
  hrefWithParams,
  toggleAmount,
}: any) => {
  const ProfileImg = ({ accountId, profile }: any) => (
    <ProfileImage accountId={accountId} profile={profile} style={{}} />
  );

  const CheckBoxWrapper = ({ id, checked, onClick }: any) => (
    <CheckBox
      {...{
        id,
        checked,
        onClick,
      }}
    />
  );

  const getFeesBasisPoints = (protocolConfig: any, potDetail: any) => {
    if (protocolConfig) {
      return [protocolConfig.account_id, protocolConfig.basis_points, potDetail.referral_fee_public_round_basis_points];
    } else {
      return ["", 0, 0];
    }
  };

  const pollForDonationSuccess = ({ projectIds, afterTs, accountId, openDonationSuccessModal, potId }: any) => {
    // poll for updates
    const pollIntervalMs = 1000;
    // const totalPollTimeMs = 60000; // consider adding in to make sure interval doesn't run indefinitely
    const pollId = setInterval(() => {
      PotSDK.asyncGetDonationsForDonor(potId, accountId)
        .then((alldonations: any) => {
          const donations: Record<string, any> = {};
          for (const donation of alldonations) {
            const { project_id, donated_at_ms, donated_at } = donation;
            if (projectIds.includes(project_id) && (donated_at_ms || donated_at) > afterTs) {
              donations[project_id] = donation;
            }
          }
          if (Object.keys(donations).length === projectIds.length) {
            // display success message
            clearInterval(pollId);
            openDonationSuccessModal(donations);
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    }, pollIntervalMs);
  };

  const protocolConfigContractId = potDetail.protocol_config_provider.split(":")[0];
  const protocolConfigViewMethodName = potDetail.protocol_config_provider.split(":")[1];
  const protocolConfig =
    protocolConfigContractId && protocolConfigViewMethodName
      ? Near.view<any>(protocolConfigContractId, protocolConfigViewMethodName, {})
      : null;

  const [protocolFeeRecipientAccount, protocolFeeBasisPoints, referralFeeBasisPoints] = getFeesBasisPoints(
    protocolConfig,
    potDetail,
  );

  const chefFeeBasisPoints = potDetail?.chef_fee_basis_points;

  const donationAmountIndivisible = (num: number) => Big(num).mul(new Big(10).pow(selectedDenomination.decimals));

  const projectAmount = parseFloat(amount) / Object.keys(selectedProjects).length;

  const autoProjectAmount = donationAmountIndivisible(projectAmount);

  const handleDonate = () => {
    const now = Date.now();

    const successArgs = {
      projectIds: Object.keys(selectedProjects),
      afterTs: now,
      accountId,
      openDonationSuccessModal,
      amount,
      potId,
    };

    const transactions: any[] = [];

    Object.keys(selectedProjects).forEach((project) => {
      let amount: any = 0;
      if (donationType === "auto") {
        amount = autoProjectAmount;
      } else {
        amount = donationAmountIndivisible(selectedProjects[project]);
      }

      if (amount) {
        transactions.push({
          contractName: potId,
          methodName: "donate",
          args: {
            referrer_id: referrerId,
            project_id: project,
            bypass_protocol_fee: bypassProtocolFee,
            ...(bypassChefFee ? { custom_chef_fee_basis_points: 0 } : {}),
          },
          deposit: amount.toFixed(0),
          gas: "300000000000000",
        });
      }
    });

    Near.call(transactions);

    pollForDonationSuccess(successArgs);
  };

  return (
    <Container>
      <ContentScrollable>
        <div>
          <Label>Total amount</Label>
          <Amout
            onClick={() =>
              updateState({
                toggleAmount: !toggleAmount,
              })
            }
          >
            <div>{selectedDenomination.icon ? <img src={selectedDenomination.icon} /> : <NearIcon />}</div>
            <div>
              {amount} <span>{selectedDenomination.text}</span>
            </div>
            {nearToUsd && <div className="usd-amount">~${(nearToUsd * amount).toFixed(2)}</div>}
            <div className="toggle-icon">
              <svg
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  rotate: !toggleAmount ? "" : "90deg",
                }}
              >
                <path
                  d="M1.70501 0L0.295013 1.41L4.87501 6L0.295013 10.59L1.70501 12L7.70501 6L1.70501 0Z"
                  fill="#7B7B7B"
                />
              </svg>
            </div>
          </Amout>
        </div>
        <Projects className={`${!toggleAmount ? "hidden" : ""}`}>
          {Object.keys(selectedProjects).map((project_id) => {
            const profile = Social.getr<any>(`${project_id}/profile`);

            return selectedProjects[project_id] > 0 || donationType === "auto" ? (
              <div className={`project`} key={project_id}>
                <ProfileImg profile={profile} />
                <div className="info">
                  {profile?.name && <div className="name">{_address(profile?.name, 20)}</div>}
                  <a className="address" href={hrefWithParams(`?tab=project&projectId=${project_id}`)} target="_blank">
                    {_address(project_id, 20)}
                  </a>
                </div>
                <ProjectAmount>
                  <div>
                    {" "}
                    {donationType === "auto"
                      ? projectAmount < 0.01
                        ? "<0.01"
                        : projectAmount.toFixed(2)
                      : selectedProjects[project_id]}{" "}
                  </div>
                  <NearIcon />
                </ProjectAmount>
              </div>
            ) : (
              ""
            );
          })}
        </Projects>
        <BreakdownSummary
          {...{
            ...props,
            referrerId,
            protocolFeeBasisPoints,
            referralFeeBasisPoints,
            bypassChefFee,
            chef: potDetail?.chef,
            chefFeeBasisPoints,
            totalAmount: amount,
            bypassProtocolFee: bypassProtocolFee,
            ftIcon: selectedDenomination.icon,
          }}
        />
        <FeesRemoval>
          <div className="check">
            <CheckBoxWrapper
              id="bypassProtocolFeeSelector"
              checked={bypassProtocolFee}
              onClick={(e: any) => {
                updateState({ bypassProtocolFee: e.target.checked });
              }}
            />

            <div className="label">Remove {protocolFeeBasisPoints / 100 || "-"}% protocol fee</div>
            <a
              href={hrefWithParams(`?tab=profile&accountId=${protocolFeeRecipientAccount}`)}
              className="address"
              target="_blank"
            >
              <ProfileImg accountId={protocolFeeRecipientAccount} />

              {protocolFeeRecipientAccount}
            </a>
          </div>
          {potDetail?.chef && chefFeeBasisPoints > 0 && (
            <div className="check">
              <CheckBoxWrapper
                id="bypassChefFeeSelector"
                checked={bypassChefFee}
                onClick={(e: any) => {
                  updateState({ bypassChefFee: e.target.checked });
                }}
              />

              <div className="label"> Remove {chefFeeBasisPoints / 100 || "-"}% chef fee</div>
              <a href={hrefWithParams(`?tab=profile&accountId=${potDetail?.chef}`)} className="address" target="_blank">
                <ProfileImg accountId={potDetail?.chef} />

                {potDetail?.chef}
              </a>
            </div>
          )}
        </FeesRemoval>
      </ContentScrollable>
      <ButtonWrapper>
        <Button type="primary" text="Confirm donation" onClick={handleDonate} />
      </ButtonWrapper>
    </Container>
  );
};

export default ConfirmPot;
