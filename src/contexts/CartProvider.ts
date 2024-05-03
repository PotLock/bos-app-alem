import { Storage, createContext } from "alem";

export type CartItem = {
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
  addItemstoCart: (cart: CartItem[]) => void;
  removeItemsFromCart: (idsToRemove: CartItem["id"][]) => void;
  clearCart: () => void;
};

const DEFAULT_CART = {};

const CART_KEY = "cart";

const getCart = () => JSON.parse(Storage.get(CART_KEY)) || DEFAULT_CART;

const CartProvider = () => {
  const { setDefaultData, updateData, getSelf } = createContext<CartContextProps>("cart-context");

  const updateCart = (cart: Cart) => {
    Storage.set(CART_KEY, JSON.stringify(cart));
    updateData({
      cart,
    });
  };

  // Set default data
  setDefaultData({
    cart: getCart(),
    addItemstoCart: (items: CartItem[]) => {
      const { cart } = getSelf();
      items.forEach((item) => {
        cart[item.id] = item;
      });
      updateCart(cart);
    },
    clearCart: () => {
      updateData({
        cart: DEFAULT_CART,
      });
      updateCart(DEFAULT_CART);
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
      updateCart(cart);
    },
  });
};

// Main context to be injected
export default CartProvider;
