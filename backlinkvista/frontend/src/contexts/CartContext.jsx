import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { endpoints } from "../utils/api";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Array of website IDs
  const [cartItems, setCartItems] = useState([]); // Array of full website objects

  const { user } = useAuth();

  // Fetch cart items when the component mounts or user changes
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!user || !user._id) return;

        const response = await endpoints.marketplace.getCartItems(user._id);

        if (response.data.success) {
          const websites = response.data.cart.websites || [];

          // ✅ Ensure both cart and cartItems are set with consistent data
          setCart(websites.map((item) => item.websiteId._id)); // IDs only
          setCartItems(websites.map((item) => item.websiteId)); // Full objects
        }
      } catch (error) {
        console.error("Error fetching cart items", error);
      }
    };

    if (user) {
      fetchCart();
    }
  }, [user]);

  // Sync cart state with localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Add to cart with consistent population of full website objects
  const addToCart = useCallback(
    async (websiteId) => {
      if (cart.includes(websiteId)) {
        toast.error("Item already in cart");
        return;
      }

      try {
        const response = await endpoints.marketplace.addToCart(
          websiteId,
          user._id
        );

        if (response.data.success) {
          const updatedCart = response.data.cart.websites || [];

          // ✅ Populate cart with full website objects
          setCart(updatedCart.map((item) => item.websiteId._id)); // IDs only
          setCartItems(updatedCart.map((item) => item.websiteId)); // Full objects

          toast.success("Item added to cart");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add item to cart");
      }
    },
    [cart, user]
  );

  const removeFromCart = useCallback(
    async (websiteId) => {
      try {
        const response = await endpoints.marketplace.removeFromCart(
          websiteId,
          user._id
        );

        if (response.data.success) {
          // Locally remove the item using websiteId
          setCart((prev) => prev.filter((id) => id !== websiteId)); 
          setCartItems((prev) => prev.filter((item) => item._id !== websiteId)); 

          toast.success("Item removed from cart");
        } else {
          toast.error("Failed to remove item from cart");
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
        toast.error("Error removing item");
      }
    },
    [user, cart, cartItems]
  );

  // ✅ Clear entire cart
  const clearCart = useCallback(async (userId) => {
    try {
      const response = await endpoints.marketplace.clearCart(user._id);
      if (response.data.success) {
        setCart([]);
        setCartItems([]);
        toast.success(response.data.message);
      }
    } catch (err) {
      console.error("Error clear from cart:", err);
      toast.error("Error clear cart");
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,
        cartItems,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
