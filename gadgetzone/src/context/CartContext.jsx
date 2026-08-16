// ============================================================
// src/context/CartContext.jsx
// Global Cart State via Context API
// ============================================================

import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { cartService } from "../services/api";
const CartContext = createContext();

// Actions
const CART_ACTIONS = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  UPDATE_QTY: "UPDATE_QTY",
  CLEAR_CART: "CLEAR_CART",
};

// Reducer handles all cart operations
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const exists = state.items.find((i) => i._id === action.payload._id);
      if (exists) {
        // Already in cart — increment quantity
        return {
          ...state,
          items: state.items.map((i) =>
            i._id === action.payload._id ? { ...i, quantity: action.payload.quantity } : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload ],

      };
    }
    case CART_ACTIONS.REMOVE_ITEM:
      return { ...state, items: state.items.filter((i) => i._id !== action.payload) };

    case CART_ACTIONS.UPDATE_QTY:
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i._id !== action.payload._id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i._id === action.payload._id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };

    case CART_ACTIONS.CLEAR_CART:
      return { ...state, items: [] };

    default:
      return state;
  }
}


export function CartProvider({ children }) {
const [state, dispatch] = useReducer(cartReducer, {
  items: [],
});

// logged-in user 
const { user } = useAuth();
const navigate = useNavigate();

const userId = user?._id;
 

  useEffect(() => {
  const loadCart = async () => {
    if (!userId) {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      return;
    }

    try {
      const data = await cartService.getCart(userId);

      dispatch({
        type: CART_ACTIONS.CLEAR_CART,
      });

      data.items.forEach((item) => {
        dispatch({
          type: CART_ACTIONS.ADD_ITEM,
          payload: {
            ...item.product,
            quantity: item.quantity,
          },
        });
      });
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  loadCart();
}, [userId]);

  // Helper: total item count (badge)
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  // Helper: total price
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

const addToCart = async (product, quantity) => {
  
  if (!userId) {
    navigate("/login");
    return;
  }

  try {
    await cartService.addToCart({
      userId,
      productId: product._id,
      quantity: quantity,
    });

    console.log("ADDING TO CART:", {
  productId: product._id,
  quantity: quantity,
});

    const data = await cartService.getCart(userId);

    dispatch({
      type: CART_ACTIONS.CLEAR_CART,
    });

    data.items.forEach((item) => {
      dispatch({
        type: CART_ACTIONS.ADD_ITEM,
        payload: {
          ...item.product,
          quantity: item.quantity,
        },
      });
    });
  } catch (err) {
    console.error(err);
  }
};



const removeFromCart = async (productId) => {
  if (!userId) {
    navigate("/login");
    return;
  }

  try {
    await cartService.removeFromCart({
      userId,
      productId,
    });

    const data = await cartService.getCart(userId);

    dispatch({ type: CART_ACTIONS.CLEAR_CART });

    data.items.forEach((item) => {
      dispatch({
        type: CART_ACTIONS.ADD_ITEM,
        payload: {
          ...item.product,
          quantity: item.quantity,
        },
      });
    });

  } catch (err) {
    console.error(err);
  }
};

const updateQuantity = async (productId, quantity) => {
  if (!userId) {
    navigate("/login");
    return;
  }

  try {
    await cartService.updateCart({
      userId,
      productId,
      quantity,
    });

    const data = await cartService.getCart(userId);

    dispatch({
      type: CART_ACTIONS.CLEAR_CART,
    });

    data.items.forEach((item) => {
      dispatch({
        type: CART_ACTIONS.ADD_ITEM,
        payload: {
          ...item.product,
          quantity: item.quantity,
        },
      });
    });

  } catch (err) {
    console.error(err);
  }
};

const clearCart = async () => {
  if (!userId) {
    return;
  }

  try {
    await cartService.clearCart(userId);

    dispatch({
      type: CART_ACTIONS.CLEAR_CART,
    });

  } catch (err) {
    console.error(err);
  }
};



const isInCart = (id) => state.items.some((i) => i._id === id);
const getCartQuantity = (id) => {
  const item = state.items.find((i) => i._id === id);
  return item ? item.quantity : 0;
};
  return (
  <CartContext.Provider value={{
    cart: state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartQuantity,
    itemCount,
    totalPrice
  }}>
        {children}
   </CartContext.Provider>
  );
}

// Custom hook for clean imports
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
