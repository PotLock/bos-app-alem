import { useCart } from "@app/hooks/useCart";
import { CartButton, CartCountContainer, CartText } from "./styles";
import { navigate } from "alem";

const NavItem = () => {
  const { cart } = useCart();
  console.log("cart", cart);

  const numCartItems = cart ? Object.keys(cart).length : 0;
  return (
    <>
      <CartButton
        numCartItems={numCartItems}
        onClick={() => {
          numCartItems > 0 ? navigate.to("cart") : {};
        }}
      >
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
