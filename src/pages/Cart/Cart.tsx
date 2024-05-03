import {
  ActionsContainer,
  ColumnLeft,
  ColumnRight,
  Container,
  Icon,
  InnerContainer,
  SubTitle,
  SuccessContainer,
  Title,
} from "./styles";
import Button from "@app/components/Button";
import CheckBox from "@app/components/Inputs/Checkbox/Checkbox";
import hrefWithParams from "@app/utils/hrefWithParams";
import { Near, State, context, state, useEffect, useMemo, useParams, useState } from "alem";
import CheckoutItem from "./components/CheckoutItem/CheckoutItem";
import CheckoutBreakdown from "./components/CheckoutBreakdown/CheckoutBreakdown";
import { useCart } from "@app/hooks/useCart";

const Cart = () => {
  const { cart, removeItemsFromCart } = useCart();
  const numCartItems = Object.keys(cart).length;

  const { transactionHashes: passedTransactionHashes } = useParams();

  const DEFAULT_GATEWAY = "https://bos.potlock.org/";
  const POTLOCK_TWITTER_ACCOUNT_ID = "PotLock_";

  const DEFAULT_SHARE_HASHTAGS = ["BOS", "PublicGoods", "Donations"];

  State.init({
    selectedProjectIds: [],
    masterSelectorSelected: false,
    successfulDonationRecipientId: null,
    successfulDonationsRecipientProfiles: null,
  });

  const allSelected = state.selectedProjectIds.length !== 0 && state.selectedProjectIds.length === numCartItems;

  if (passedTransactionHashes && !state.successfulDonationsRecipientProfiles) {
    // handles the case where the user is redirected from the wallet after a successful donation
    const transactionHashes = passedTransactionHashes.split(",");
    for (let i = 0; i < transactionHashes.length; i++) {
      const txHash = transactionHashes[i];
      const body = JSON.stringify({
        jsonrpc: "2.0",
        id: "dontcare",
        method: "tx",
        params: [txHash, context.accountId],
      });
      const res: any = fetch("https://rpc.mainnet.near.org", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      if (res.ok) {
        const methodName = res.body.result.transaction.actions[0].FunctionCall.method_name;
        const successVal = res.body.result.status?.SuccessValue;
        const result = JSON.parse(Buffer.from(successVal, "base64").toString("utf-8")); // atob not working
        const args = JSON.parse(
          Buffer.from(res.body.result.transaction.actions[0].FunctionCall.args, "base64").toString("utf-8"),
        );
        const recipientId =
          methodName === "donate"
            ? result.recipient_id
            : methodName === "ft_transfer_call"
            ? JSON.parse(args.msg).recipient_id
            : "";
        if (recipientId) {
          Near.asyncView("social.near", "get", { keys: [`${recipientId}/profile/**`] }).then((socialData) => {
            State.update({
              successfulDonationsRecipientProfiles: {
                ...state.successfulDonationsRecipientProfiles,
                [recipientId]: socialData[recipientId]["profile"],
              },
            });
          });
        }
      }
    }
  }

  useEffect(() => {
    // handles extension wallet case, where user is not redirected (therefore no transactionHashes)
    if (state.successfulDonationRecipientId && !state.successfulDonationsRecipientProfiles) {
      Near.asyncView("social.near", "get", {
        keys: [`${state.successfulDonationRecipientId}/profile/**`],
      }).then((socialData) => {
        State.update({
          successfulDonationsRecipientProfiles: {
            // don't spread the existing state, as it may be null
            [state.successfulDonationRecipientId]: socialData[state.successfulDonationRecipientId]["profile"],
          },
        });
      });
    }
  }, [state.successfulDonationRecipientId, state.successfulDonationsRecipientProfiles]);

  const twitterIntent = useMemo(() => {
    if (!state.successfulDonationsRecipientProfiles) return;
    const recipientIds = Object.keys(state.successfulDonationsRecipientProfiles);
    const twitterIntentBase = "https://twitter.com/intent/tweet?text=";

    // if more than one recipient, share the Explore Projects page; otherwise, share the project page
    let url = DEFAULT_GATEWAY + `potlock.near/widget/Index?referrerId=${context.accountId}`;
    if (recipientIds.length === 1) {
      url = url + `&tab=project&projectId=${recipientIds[0]}`;
    } else {
      url = url + `&tab=projects`;
    }

    // Initialize an empty array to hold the recipient profiles along with their identifiers
    const recipientProfiles = [];

    // Iterate over each entry in the successfulDonationsRecipientProfiles object
    for (const [recipientId, profile] of Object.entries(state.successfulDonationsRecipientProfiles)) {
      // Determine the identifier to use: Twitter handle, name, or recipient ID
      const identifier = profile.linktree?.twitter
        ? `@${profile.linktree.twitter}`
        : profile.name
        ? profile.name
        : recipientId;

      // Add the profile and its identifier to the array
      recipientProfiles.push({
        identifier,
        hasTwitter: !!profile.linktree?.twitter,
      });
    }

    // Sort the recipientProfiles array to put ones with Twitter handles first
    recipientProfiles.sort((a, b) => {
      if (a.hasTwitter && !b.hasTwitter) return -1;
      if (!a.hasTwitter && b.hasTwitter) return 1;
      return 0;
    });

    // Extract the identifiers from the sorted array
    const sortedIdentifiers = recipientProfiles.map((profile) => profile.identifier);

    // Join the sorted recipient identifiers with " & " to create a single string
    const recipientsText = sortedIdentifiers.join(" & ");

    let text = `I just donated to ${recipientsText} on @${POTLOCK_TWITTER_ACCOUNT_ID}! Support public goods at `;
    text = encodeURIComponent(text);
    url = encodeURIComponent(url);
    return twitterIntentBase + text + `&url=${url}` + `&hashtags=${DEFAULT_SHARE_HASHTAGS.join(",")}`;
  }, [state.successfulDonationsRecipientProfiles]);

  return (
    // <div>
    <Container>
      {passedTransactionHashes || state.successfulDonationRecipientId ? (
        <SuccessContainer>
          <Title>Thanks for donating!</Title>
          {twitterIntent && (
            <Button
              {...{
                href: twitterIntent,
                target: "_blank",
                type: "primary",
                text: "Share to Twitter",
                disabled: !twitterIntent,
                style: {
                  width: "300px",
                },
              }}
            />
          )}
          <Button
            {...{
              href: hrefWithParams(`?tab=projects`),
              type: twitterIntent ? "secondary" : "primary",
              text: "Explore projects",
              style: {
                width: "300px",
              },
            }}
          />
        </SuccessContainer>
      ) : (
        <>
          <ColumnLeft>
            <Title>Donation Cart</Title>
            <ActionsContainer>
              <InnerContainer>
                <CheckBox
                  {...{
                    id: "masterSelector",
                    disabled: numCartItems === 0,
                    checked: state.masterSelectorSelected,
                    onClick: (e: any) => {
                      // if allSelected, then deselect all
                      // if not allSelected, then select all
                      const selectedProjectIds = Object.keys(cart).filter((_) => {
                        if (allSelected) {
                          return false;
                        }
                        return true;
                      });
                      State.update({
                        selectedProjectIds,
                        masterSelectorSelected: !allSelected,
                      });
                    },
                  }}
                />

                <SubTitle>Select all</SubTitle>
              </InnerContainer>
              <InnerContainer
                style={{ cursor: "pointer" }}
                onClick={() => {
                  // doesn't do anything if nothing selected
                  if (state.selectedProjectIds.length === 0) return;
                  // delete selected projects
                  removeItemsFromCart(state.selectedProjectIds);
                  // uncheck box
                  State.update({ selectedProjectIds: [], masterSelectorSelected: false });
                }}
              >
                <Icon viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.5 14C2.0875 14 1.73437 13.8531 1.44062 13.5594C1.14687 13.2656 1 12.9125 1 12.5V2.5H0V1H4V0H8V1H12V2.5H11V12.491C11 12.9137 10.8531 13.2708 10.5594 13.5625C10.2656 13.8542 9.9125 14 9.5 14H2.5ZM9.5 2.5H2.5V12.5H9.5V2.5ZM4 11H5.5V4H4V11ZM6.5 11H8V4H6.5V11Z"
                    fill="#7B7B7B"
                  />
                </Icon>
                <SubTitle>Delete</SubTitle>
              </InnerContainer>
            </ActionsContainer>
            {numCartItems === 0 ? (
              <div>No items in cart</div>
            ) : (
              Object.keys(cart).map((projectId) => {
                // setProjectId(projectId); // wtf is this?? commenting out
                const checked = state.selectedProjectIds.includes(projectId);
                return (
                  <CheckoutItem
                    {...{
                      cartItem: cart[projectId],
                      checked,
                      handleCheckboxClick: (e) => {
                        // if selected, then deselect
                        // else, select
                        let selectedProjectIds = state.selectedProjectIds;
                        if (checked) {
                          selectedProjectIds = selectedProjectIds.filter((id: string) => id !== projectId);
                        } else {
                          selectedProjectIds.push(projectId);
                        }
                        const updatedState: any = {
                          selectedProjectIds,
                        };
                        if (selectedProjectIds.length !== 0 && selectedProjectIds.length !== numCartItems) {
                          updatedState.masterSelectorSelected = false;
                        }
                        State.update(updatedState);
                      },
                    }}
                  />
                );
              })
            )}
          </ColumnLeft>
          <ColumnRight>
            <CheckoutBreakdown
              {...{
                updateSuccessfulDonationRecipientId: (recipientId: any) =>
                  State.update({ successfulDonationRecipientId: recipientId }),
              }}
            />
          </ColumnRight>
        </>
      )}
    </Container>
    // </div>
  );
};

export default Cart;
