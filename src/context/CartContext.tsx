import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { createMMKV } from 'react-native-mmkv';
import { CartItem, Starship } from '../types';
import { MAX_CART_QUANTITY } from '../constants';

const STORAGE_KEY = 'cart_items';

const storage = createMMKV({
  id: `user-storage`,
});
interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Starship }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { url: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.starship.url === action.payload.url);

      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + 1, MAX_CART_QUANTITY);
        return {
          items: state.items.map(item =>
            item.starship.url === action.payload.url
              ? { ...item, quantity: newQuantity }
              : item
          ),
        };
      } else {
        // Add new item
        return {
          items: [...state.items, { starship: action.payload, quantity: 1 }],
        };
      }
    }

    case 'REMOVE_ITEM': {
      return {
        items: state.items.filter(item => item.starship.url !== action.payload),
      };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          items: state.items.filter(item => item.starship.url !== action.payload.url),
        };
      }
      if (action.payload.quantity > MAX_CART_QUANTITY) {
        return state;
      }
      return {
        items: state.items.map(item =>
          item.starship.url === action.payload.url
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case 'CLEAR_CART': {
      return { items: [] };
    }

    case 'LOAD_CART': {
      return { items: action.payload };
    }

    default:
      return state;
  }
};

interface CartContextType {
  items: CartItem[];
  addItem: (starship: Starship) => void;
  removeItem: (url: string) => void;
  updateQuantity: (url: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from storage on mount
  useEffect(() => {
    try {
      const stored = storage.getString(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate that parsed data is an array
        if (Array.isArray(parsed)) {
          // Validate each item has required structure
          const validItems = parsed.filter(
            (item: any) =>
              item &&
              typeof item === 'object' &&
              item.starship &&
              typeof item.quantity === 'number' &&
              item.quantity > 0
          );
          if (validItems.length > 0) {
            dispatch({ type: 'LOAD_CART', payload: validItems });
          } else {
            // Clear corrupted data
            (storage).remove(STORAGE_KEY);
          }
        } else {
          // Invalid data structure, clear it
          (storage).remove(STORAGE_KEY);
        }
      }
    } catch (error) {
      // JSON parse failed or other error - clear corrupted data
      try {
        (storage).remove(STORAGE_KEY);
      } catch {
        // Ignore delete errors
      }
    }
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    try {
      storage.set(STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      // Storage write failed - could be due to disk space or permissions
      // In production, consider logging to error tracking service
    }
  }, [state.items]);

  const addItem = (starship: Starship) => {
    dispatch({ type: 'ADD_ITEM', payload: starship });
  };

  const removeItem = (url: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: url });
  };

  const updateQuantity = (url: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { url, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    (storage).remove(STORAGE_KEY);
  };

  const getTotalItems = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = (): number => {
    return state.items.reduce((total, item) => {
      const creditsStr = item.starship.cost_in_credits;
      // Handle "unknown" or invalid cost values
      if (!creditsStr || creditsStr === 'unknown' || creditsStr.trim() === '') {
        return total;
      }
      const credits = parseFloat(creditsStr);
      if (isNaN(credits) || credits <= 0) {
        return total;
      }
      const aed = credits / 10000;
      return total + aed * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
