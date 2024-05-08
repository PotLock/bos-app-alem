import { RouteLink, navigate } from "alem";
import { useCart } from "@app/hooks/useCart";
import routesPath from "@app/routes/routesPath";
import { CartButton, CartCountContainer, CartText } from "./styles";

const NavItem = () => {
  const { cart } = useCart();

  const numCartItems = cart ? Object.keys(cart).length : 0;
  return (
    <RouteLink to={routesPath.CART_TAB}>
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
    </RouteLink>
  );
};

export default NavItem;
