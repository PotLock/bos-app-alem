import { Social, State, state, useParams } from "alem";
import {
  Description,
  DetailsContainer,
  FtIcon,
  Icon,
  ImageContainer,
  ItemContainer,
  ItemLeft,
  ItemRight,
  Row,
  Title,
} from "./styles";
import NearIcon from "@app/assets/svgs/near-icon";
import { useState } from "react";
import CheckBox from "@app/components/Inputs/Checkbox/Checkbox";
import ProfileImage from "@app/components/mob.near/ProfileImage";
import hrefWithParams from "@app/utils/hrefWithParams";
import Tag from "@app/components/PotCard/Tag/Tag";
import Text from "@app/components/Inputs/Text/Text";
import Select from "@app/components/Inputs/Select/Select";
import BreakdownSummary from "@app/components/Cart/BreakdownSummary/BreakdownSummary";

const CheckoutItem = (props: {
  cartItem: any;
  checked: boolean;
  handleCheckboxClick: (e: any) => void;
  profile?: any;
}) => {
  const { cartItem, checked, handleCheckboxClick } = props;

  const { referrerId } = useParams();

  const projectId = cartItem?.id;
  const isPotDonation = cartItem?.potId;

  const profile = props.profile || Social.get(`${projectId}/profile/**`, "final") || {};

  const [itemAmount, setItemAmount] = useState(cartItem?.amount);
  const [itemToken, setItemToken] = useState(cartItem?.token);

  State.init({
    ftBalances: null,
    denominationOptions: [{ text: "NEAR", value: "NEAR", selected: itemToken.text === "NEAR", decimals: 24 }],
  });

  // * REMOVING FTs FROM CHECKOUT FOR NOW *
  // const ftBalancesRes = useCache(
  //   () =>
  //     asyncFetch(
  //       `https://near-mainnet.api.pagoda.co/eapi/v1/accounts/${context.accountId}/balances/FT`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "x-api-key": "dce81322-81b0-491d-8880-9cfef4c2b3c2",
  //         },
  //       }
  //     )
  //       .then((res) => res.body)
  //       .catch((e) => console.log("error fetching ft balances: ", e)),
  //   `ft-balances-${context.accountId}`
  // );
  // console.log("ftBalancesRes: ", ftBalancesRes);

  // console.log("state in CheckoutItem: ", state);

  // * REMOVING FTs FROM CHECKOUT FOR NOW *
  // useEffect(() => {
  //   if (context.accountId && !isPotDonation && ftBalancesRes && !state.ftBalances) {
  //     State.update({
  //       ftBalances: ftBalancesRes.balances,
  //       denominationOptions: state.denominationOptions.concat(
  //         ftBalancesRes.balances
  //           .map(({ amount, contract_account_id, metadata }) => ({
  //             amount,
  //             id: contract_account_id,
  //             text: metadata.symbol,
  //             value: metadata.symbol,
  //             icon: metadata.icon,
  //             decimals: metadata.decimals,
  //             selected: false,
  //           }))
  //           .filter((option) => option.text.length < 10)
  //       ),
  //     });
  //   }
  // }, [context.accountId, state.ftBalances, ftBalancesRes, isPotDonation]);

  return (
    <ItemContainer>
      <ItemLeft>
        <CheckBox
          {...{
            id: "selector-" + projectId,
            checked,
            onClick: handleCheckboxClick,
          }}
        />
      </ItemLeft>
      <ItemRight>
        <ImageContainer>
          <ProfileImage
            {...{
              accountId: projectId,
              style: {
                width: "40px",
                height: "40px",
                border: "none",
                marginRight: "24px",
              },
              className: "mb-2",
              imageClassName: "rounded-circle w-100 h-100 d-block",
              thumbnail: false,
            }}
          />
        </ImageContainer>
        <DetailsContainer>
          <Row>
            <Title href={hrefWithParams(`?tab=project&projectId=${projectId}`)}>{profile.name ?? ""}</Title>
            <Tag
              {...{
                backgroundColor: isPotDonation ? "#FEF6EE" : "#F6F5F3",
                borderColor: isPotDonation ? "rgba(219, 82, 27, 0.36)" : "#DBDBDB",
                textColor: isPotDonation ? "#EA6A25" : "#292929",
                text: isPotDonation ? (cartItem.potDetail ? cartItem.potDetail.pot_name : "-") : "Direct Donation",
              }}
            />
          </Row>
          <Description>{profile.description ?? ""}</Description>
          <Text
            {...{
              label: "Amount",
              placeholder: "0",
              value: itemAmount,
              onChange: (amount) => {
                amount = amount.replace(/[^\d.]/g, ""); // remove all non-numeric characters except for decimal
                if (amount === ".") amount = "0.";
                setItemAmount(amount);
              },
              onBlur: (e) => {
                //  it is not defined
                // updateItemInCart({
                //   ...cartItem,
                //   amount: e.target.value,
                // });
              },
              inputStyles: {
                textAlign: "right",
                borderRadius: "0px 4px 4px 0px",
              },
              preInputChildren: (
                <Select
                  {...{
                    noLabel: true,
                    placeholder: "",
                    options: state.denominationOptions,
                    value: { text: itemToken.text, value: itemToken.value },
                    onChange: ({ text, value }) => {
                      const token = state.denominationOptions.find((option: any) => option.text === text);
                      setItemToken(token);
                      setItemAmount(undefined);
                      //  it is not defined
                      //   updateCartItem({
                      //     ...cartItem,
                      //     token: token,
                      //     amount: undefined,
                      //   });
                    },
                    containerStyles: {
                      width: "auto",
                    },
                    inputStyles: {
                      border: "none",
                      borderRight: "1px #F0F0F0 solid",
                      borderRadius: "4px 0px 0px 4px",
                      width: "auto",
                      padding: "12px 16px",
                      boxShadow: "0px -2px 0px rgba(93, 93, 93, 0.24) inset",
                    },
                    iconLeft: itemToken.text == "NEAR" ? <NearIcon /> : <FtIcon src={itemToken.icon} />,
                  }}
                />
              ),
            }}
          />
          <BreakdownSummary
            {...{
              ftIcon: itemToken.icon,
              referrerId,
              totalAmount: itemAmount,
              bypassProtocolFee: false, // TODO: allow user to choose
              containerStyle: { marginTop: "16px" },
            }}
          />
        </DetailsContainer>
      </ItemRight>
    </ItemContainer>
  );
};

export default CheckoutItem;
