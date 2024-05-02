import { createContext } from "alem";

type CartItem = {
  id: string;
  amount: string;
  token: string;
  referrerId?: string;
  potId?: string;
};

type Cart = {
  [id: string]: CartItem;
};

// potDetail: activeRound ? state.detailForPots[activeRound] : null,

export type CartContextProps = {
  cart: Cart;

  /**
   * Set cart
   * @param item
   * @returns
   */
  addItemstoCart: (cart: CartItem) => void;
  removeItemsFromCart: (idsToRemove: CartItem["id"][]) => void;
  clearCart: () => void;
};

const DEFAULT_CART = {};

const CartProvider = () => {
  const { setDefaultData, updateData, getSelf } = createContext<CartContextProps>("cart-context");

  // Set default data
  setDefaultData({
    cart: DEFAULT_CART,
    addItemstoCart: (item: CartItem) => {
      const { cart } = getSelf();
      updateData({
        cart: {
          ...cart,
          [item.id]: item,
        },
      });
    },
    clearCart: () => {
      updateData({
        cart: DEFAULT_CART,
      });
    },
    removeItemsFromCart: (idsToRemove: CartItem["id"][]) => {
      const { cart } = getSelf();
      idsToRemove.forEach((id) => {
        // Check if id key exists in the cart
        if (cart.hasOwnProperty(id)) {
          // If the id exists, delete it from the cart
          delete cart[id];
        }
      });
      updateData({
        cart,
      });
    },
  });
};

// Main context to be injected
export default CartProvider;
