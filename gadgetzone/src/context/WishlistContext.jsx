// ============================================================
// src/context/WishlistContext.jsx
// Global Wishlist State via Context API
// ============================================================

import { createContext, useContext, useReducer, useEffect } from "react";
import { wishlistService } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
const WishlistContext = createContext();

function wishlistReducer(state, action) {
  switch (action.type) {
    case "ADD":
      if (state.items.find((i) => i._id === action.payload._id)) return state;
      return { items: [...state.items, action.payload] };
    case "REMOVE":
      return { items: state.items.filter((i) => i._id !== action.payload) };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}



export function WishlistProvider({ children }) {
const [state, dispatch] = useReducer(wishlistReducer, {
  items: [],
});

const { user } = useAuth();
const navigate = useNavigate();

const userId = user?._id;

useEffect(() => {
  const loadWishlist = async () => {
    if (!userId) {
      dispatch({ type: "CLEAR" });
      return;
    }
    try {
      const data = await wishlistService.getWishlist(userId);

      dispatch({
        type: "CLEAR",
      });

      data.products.forEach((product) => {
        dispatch({
          type: "ADD",
          payload: product,
        });
      });

    } catch (err) {
      console.error(err);
    }
  };

  loadWishlist();
}, [userId]);

  
const addToWishlist = async (product) => {
  if (!userId) {
    navigate("/login");
    return;
  }

  try {
    await wishlistService.addToWishlist({
      userId,
      productId: product._id,
    });

    const data = await wishlistService.getWishlist(userId);

    dispatch({
      type: "CLEAR",
    });

    data.products.forEach((product) => {
      dispatch({
        type: "ADD",
        payload: product,
      });
    });

  } catch (err) {
    console.error(err);
  }
};

const removeFromWishlist = async (productId) => {
  if (!userId) {
    navigate("/login");
    return;
  }

  try {
    await wishlistService.removeFromWishlist({
      userId,
      productId,
    });

    const data = await wishlistService.getWishlist(userId);

    dispatch({
      type: "CLEAR",
    });

    data.products.forEach((product) => {
      dispatch({
        type: "ADD",
        payload: product,
      });
    });

  } catch (err) {
    console.error(err);
  }
};

const clearWishlist = () => dispatch({ type: "CLEAR" });
  const isInWishlist = (id) => state.items.some((i) => i._id === id);

  return (
    <WishlistContext.Provider value={{ wishlist: state, addToWishlist, removeFromWishlist, clearWishlist, isInWishlist, wishlistCount: state.items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
