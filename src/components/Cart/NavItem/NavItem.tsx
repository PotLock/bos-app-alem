import { VM } from "alem";
import { CartButton, CartCountContainer, CartText } from "./styles";

const { getCartItemCount } = VM.require("potlock.near/widget/SDK.cart") ?? {
  getCartItemCount: () => 0,
};

// const { CartModal } = VM.require("potlock.near/widget/Cart.Modal") ?? {
//   CartModal: () => <></>,
// };

const numCartItems = getCartItemCount();

const NavItem = () => {
  return (
    <>
      <CartButton numCartItems={numCartItems} onClick={() => {}}>
        <CartText>Cart</CartText>
        {numCartItems > 0 && (
          <CartCountContainer>
            <CartText style={{ fontSize: "12px" }}>{numCartItems}</CartText>
          </CartCountContainer>
        )}
      </CartButton>
    </>
  );
};

export default NavItem;
