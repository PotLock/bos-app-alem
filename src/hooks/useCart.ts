import { useContext } from "alem";
import { CartContextProps } from "@app/contexts/CartProvider";

export const useCart = () => useContext<CartContextProps>("cart-context");
