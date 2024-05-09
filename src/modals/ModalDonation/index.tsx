import {
  Big,
  Social,
  State,
  asyncFetch,
  context,
  fetch,
  state,
  useCache,
  useContext,
  useEffect,
  useMemo,
  useParams,
  useState,
} from "alem";
import PotSDK from "@app/SDK/pot";
import PotFactorySDK from "@app/SDK/potfactory";
import BannerBg from "@app/assets/svgs/banner-bg";
import { CartItem } from "@app/contexts/CartProvider";
import { useCart } from "@app/hooks/useCart";
import { useDonationModal } from "@app/hooks/useDonationModal";
import ModalOverlay from "../ModalOverlay";
import ConfirmDirect from "./ConfirmDirect/ConfirmDirect";
import ConfirmPot from "./ConfirmPot/ConfirmPot";
import FormDirect from "./FormDirect/FormDirect";
import FormPot from "./FormPot/FormPot";
import { Banner, Container, HeaderIcons } from "./styles";

const ModalDonation = () => {
  const DENOMINATION_OPTIONS = [{ text: "NEAR", value: "NEAR", decimals: 24 }];

  const { donationModalProps, setSuccessfulDonation, setDonationModalProps } = useDonationModal();
  const { addItemstoCart } = useCart();

  const onClose = () => {
    setDonationModalProps(null);
  };

  const { potId, referrerId } = useParams();

  const { projectId, multiple } = donationModalProps || {};

  const potDetail = donationModalProps?.potDetail ?? PotSDK.getConfig(potId);

  const accountId = context.accountId;

  State.init({
    amount: "",
    donationType: multiple ? "auto" : "direct",
    showBreakdown: false,
    bypassProtocolFee: false,
    bypassChefFee: false,
    addNote: false,
    donationNote: "",
    donationNoteError: "",
    allPots: null,
    intervalId: null,
    ftBalances: null,
    selectedDenomination: DENOMINATION_OPTIONS[0],
    denominationOptions: DENOMINATION_OPTIONS,
    selectedRound: "",
    currentPage: multiple ? "formPot" : "form",
    selectedProjects: {},
    toggleAmount: true,
  });

  const {
    // amount,
    // denomination,
    donationType,
    // showBreakdownm,
    // bypassProtocolFee,
    // bypassChefFee,
    // addNote,
    // donationNote,
    // donationNoteError,
    // allPots,
    // intervalId,
    // nearBalance,
    ftBalances,
    denominationOptions,
    selectedDenomination,
    selectedRound,
    currentPage,
  } = state;

  const [activeRounds, setActiveRounds] = useState<any>(null);

  const profile = Social.getr<any>(`${projectId}/profile`);
  const profileName = profile?.name || projectId;

  const pages: any = {
    form: FormDirect,
    formPot: FormPot,
    confirm: ConfirmDirect,
    confirmPot: ConfirmPot,
  };

  const ActivePageComponent = pages[currentPage];

  // get all active pots
  const pots = useCache(
    () =>
      // get all pots
      PotFactorySDK.asyncGetPots()
        .then((pots: any) => {
          const activePots = pots.map((pot: any) =>
            // if active
            PotSDK.isRoundActive(pot.id)
              // check if project had applied
              .then((isActive: boolean) => isActive && pot.id)
              .catch((e: any) => {
                console.error("error checking active round for pot: " + pot.id, e);
              }),
          );
          return Promise.all(activePots);
        })
        .catch((e: any) => {
          console.error("error getting pots: ", e);
        }),
    "active-pots",
  );

  useEffect(() => {
    if (potId && !activeRounds) {
      setActiveRounds([potId]);
      State.update({
        selectedRound: potId,
        donationType: multiple ? "auto" : "pot",
      });
    } else if (!activeRounds?.length && projectId) {
      if (!pots) setActiveRounds([]);
      (pots ?? []).forEach((pot: any, idx: number) => {
        if (pot) {
          PotSDK.asyncGetApplicationByProjectId(pot, projectId)
            .then((application: any) => {
              if (application.status === "Approved") {
                setActiveRounds((prev: any) => {
                  const prevRounds = prev || [];
                  if (!prevRounds.includes(pot)) {
                    return [...prevRounds, pot];
                  }
                });
                if (!selectedRound)
                  State.update({
                    selectedRound: pot,
                  });
              } else if (pots.length - 1 === idx && !activeRounds) {
                setActiveRounds((prev: any) => [...(prev || [])]);
              }
            })
            .catch((err: any) => {
              console.log(err);
              setActiveRounds((prev: any) => [...(prev || [])]);
            });
        }
      });
    }
  }, [pots]);

  // Get Ft Balances
  useEffect(() => {
    if (donationType === "direct") {
      asyncFetch(`https://near-mainnet.api.pagoda.co/eapi/v1/accounts/${accountId}/balances/FT`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "dce81322-81b0-491d-8880-9cfef4c2b3c2",
        },
      })
        .then((ftBalancesRes) => {
          if (ftBalancesRes) {
            const ftBalances = ftBalancesRes.body.balances;

            State.update({
              ftBalances: ftBalances,
              denominationOptions: DENOMINATION_OPTIONS.concat(
                ftBalances
                  .map(({ amount, contract_account_id, metadata }: any) => ({
                    amount,
                    id: contract_account_id,
                    text: metadata.symbol,
                    value: metadata.symbol,
                    icon: metadata.icon,
                    decimals: metadata.decimals,
                  }))
                  .filter((option: any) => option.text.length < 10),
              ),
            });
          }
        })
        .catch((err) => console.log("fetching Ft balances faild"));
    }
  }, [ftBalances, donationType]);

  const nearBalanceRes = fetch(`https://near-mainnet.api.pagoda.co/eapi/v1/accounts/${accountId}/balances/NEAR`, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "dce81322-81b0-491d-8880-9cfef4c2b3c2",
    },
  });

  const getTokenBalance = (token: string) => {
    if (token === "NEAR") {
      const nearBalance = nearBalanceRes?.body?.balance;

      return nearBalance ? parseFloat(Big(nearBalance.amount).div(Big(10).pow(24)).toFixed(2)) : null;
    }
    const balance = denominationOptions.find(
      // this is where we need the details
      (option: any) => option.text === token,
    );
    return balance ? parseFloat(Big(balance.amount).div(Big(10).pow(balance.decimals)).toFixed(2)) : null;
  };

  const ftBalance = useMemo(() => {
    return getTokenBalance(selectedDenomination.text);
  }, [selectedDenomination, ftBalances, nearBalanceRes]);

  return (
    <ModalOverlay
      onOverlayClick={(e: any) => {
        e.stopPropagation();
        onClose();
      }}
      contentStyle={{ padding: "0px" }}
    >
      <Container>
        <div>
          <Banner>
            <BannerBg className="left-pattern" />
            <BannerBg className="right-pattern" />
            <HeaderIcons>
              {!["form", "formPot"].includes(currentPage) && (
                <div
                  className="back-arrow"
                  onClick={() =>
                    State.update({
                      currentPage: multiple ? "formPot" : "form",
                    })
                  }
                >
                  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 7H3.83L9.42 1.41L8 0L0 8L8 16L9.41 14.59L3.83 9H16V7Z" fill="#FCCFCF" />
                  </svg>
                </div>
              )}

              <svg
                onClick={() => onClose()}
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
            {["confirmPot", "confirm"].includes(currentPage) ? (
              <div> Confirm donation</div>
            ) : currentPage === "formPot" ? (
              <div>Donate to Projects in {potDetail?.pot_name}</div>
            ) : (
              <div> Donate to {profileName}</div>
            )}
          </Banner>
        </div>
        <ActivePageComponent
          {...donationModalProps}
          {...state}
          accountId={accountId}
          potId={potId}
          referrerId={referrerId}
          updateState={State.update}
          ftBalance={ftBalance}
          activeRounds={activeRounds}
          DENOMINATION_OPTION={DENOMINATION_OPTIONS}
          onClose={onClose}
          potDetail={potDetail}
          getTokenBalance={getTokenBalance}
          handleAddToCart={(items: CartItem[]) => {
            addItemstoCart(items);
            onClose();
          }}
          openDonationSuccessModal={(successfulDonation: any) => {
            setSuccessfulDonation(successfulDonation);
          }}
        />
      </Container>
    </ModalOverlay>
  );
};

export default ModalDonation;
