import { Big, Near, context, useState, useParams } from "alem";
import BannerBg from "@app/assets/svgs/banner-bg";
import Button from "@app/components/Button";
import TextArea from "@app/components/Inputs/TextArea/TextArea";
import ModalOverlay from "@app/modals/ModalOverlay";
import { Banner, ButtonsWrapper, Container, HeaderIcons, InfoCard, Limit, Content } from "./styles";

const FlagModal = (props: any) => {
  const MAX_REASON_LENGTH = 250;
  const SOCIAL_CONTRACT_ID = "social.near";
  const accountId = context.accountId || "";

  const { potId } = useParams();

  const [reason, setReason] = useState("");
  const [reasonErr, setReasonErr] = useState("");

  const { onClose, flagAddress, setSuccessFlag } = props;

  const onCancel = () => {
    onClose();
    setReason("");
  };

  const fetchSocialProfile = () => {
    return Near.asyncView(SOCIAL_CONTRACT_ID, "get", { keys: [`${accountId}/profile/**`] });
  };

  const handleSuccess = () => {
    const flsgSuccess = setInterval(() => {
      fetchSocialProfile().then((profileData) => {
        const profile = profileData[accountId].profile;

        const pLBlacklistedAccounts = JSON.parse(profile.pLBlacklistedAccounts || "{}");
        const potFlaggedAcc = pLBlacklistedAccounts[potId] || {};

        if (potFlaggedAcc[flagAddress]) {
          setSuccessFlag({
            account: flagAddress,
            reason,
          });
          onCancel();
          clearInterval(flsgSuccess);
        }
      });
    }, 1000);

    // Clear the interval after 30 seconds
    setTimeout(() => {
      onCancel();
      clearInterval(flsgSuccess);
    }, 60000);
  };

  const handleFlag = () => {
    fetchSocialProfile().then((profileData) => {
      const profile = profileData[accountId].profile;

      const pLBlacklistedAccounts = JSON.parse(profile.pLBlacklistedAccounts || "{}");
      const potFlaggedAcc = pLBlacklistedAccounts[potId] || {};
      const socialArgs = {
        data: {
          [accountId]: {
            profile: {
              pLBlacklistedAccounts: JSON.stringify({
                ...pLBlacklistedAccounts,
                [potId]: {
                  ...potFlaggedAcc,
                  [flagAddress]: reason,
                },
              }),
            },
          },
        },
      };

      const socialTransaction: any = {
        contractName: SOCIAL_CONTRACT_ID,
        methodName: "set",
        args: socialArgs,
      };

      Near.asyncView(SOCIAL_CONTRACT_ID, "get_account", {
        account_id: accountId,
      }).then((account) => {
        let depositFloat = JSON.stringify(socialArgs).length * 0.00015;
        if (!account) {
          depositFloat += 0.1;
        }
        socialTransaction.deposit = Big(depositFloat).mul(Big(10).pow(24));
        Near.call(socialTransaction);
        handleSuccess();
      });
    });
  };

  return (
    <ModalOverlay contentStyle={{ padding: "0px" }} onOverlayClick={onCancel}>
      <Container>
        <div>
          <Banner>
            <BannerBg className="left-pattern" />
            <BannerBg className="right-pattern" />
            <HeaderIcons>
              <svg
                onClick={() => onCancel()}
                className="close-icon"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                  fill="#FCCFCF"
                />
              </svg>
            </HeaderIcons>
            Flag {flagAddress}
          </Banner>
        </div>
        <Content>
          <div>
            <TextArea
              {...{
                label: "Reason",
                inputRows: 4,
                inputStyle: {
                  background: "#FAFAFA",
                },
                placeholder: `Type description`,
                value: reason,
                onChange: (reason: string) => setReason(reason),
                validate: () => {
                  if (reason.length > MAX_REASON_LENGTH) {
                    setReasonErr(`Reason must be less than ${MAX_REASON_LENGTH} characters`);
                    return;
                  }
                  setReasonErr("");
                },
                error: reasonErr,
              }}
            />

            <Limit>
              {reason.length}/{MAX_REASON_LENGTH}
            </Limit>
          </div>

          <InfoCard>
            <div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 5H11V7H9V5ZM9 9H11V15H9V9ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"
                  fill="#7B7B7B"
                />
              </svg>
            </div>
            <div>Flagging this account will remove their donations when calculating payouts for this pot</div>
          </InfoCard>
          <ButtonsWrapper>
            <Button varient="plain" onClick={onCancel}>
              Cancel
            </Button>
            <Button isDisabled={!reason || !!reasonErr} onClick={handleFlag}>
              Confirm
            </Button>
          </ButtonsWrapper>
        </Content>
      </Container>
    </ModalOverlay>
  );
};

export default FlagModal;
