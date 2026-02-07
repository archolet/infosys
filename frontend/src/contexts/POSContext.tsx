'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Table, Product, CartItem, ZoneId, TAX_RATE } from '@/data/posData';

// ═══════════════════════════════════════════════════════════════════════════════
// STATE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface POSState {
  // Table selection
  selectedTable: Table | null;

  // Cart management
  cart: CartItem[];

  // Navigation
  activeZone: ZoneId;
  activeCategory: string;
  searchQuery: string;

  // Modal state
  isModalOpen: boolean;
  modalProduct: Product | null;

  // UI state
  isProcessing: boolean;
  notification: {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type POSAction =
  // Table actions
  | { type: 'SELECT_TABLE'; payload: Table }
  | { type: 'CLEAR_TABLE' }

  // Cart actions
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | {
      type: 'UPDATE_CART_ITEM';
      payload: { id: string; updates: Partial<CartItem> };
    }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'INCREMENT_QUANTITY'; payload: string }
  | { type: 'DECREMENT_QUANTITY'; payload: string }

  // Navigation actions
  | { type: 'SET_ACTIVE_ZONE'; payload: ZoneId }
  | { type: 'SET_ACTIVE_CATEGORY'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }

  // Modal actions
  | { type: 'OPEN_PRODUCT_MODAL'; payload: Product }
  | { type: 'CLOSE_MODAL' }

  // UI actions
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SHOW_NOTIFICATION'; payload: POSState['notification'] }
  | { type: 'CLEAR_NOTIFICATION' };

// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const initialState: POSState = {
  selectedTable: null,
  cart: [],
  activeZone: 'salon',
  activeCategory: 'all',
  searchQuery: '',
  isModalOpen: false,
  modalProduct: null,
  isProcessing: false,
  notification: null,
};

// ═══════════════════════════════════════════════════════════════════════════════
// REDUCER
// ═══════════════════════════════════════════════════════════════════════════════

function posReducer(state: POSState, action: POSAction): POSState {
  switch (action.type) {
    // Table actions
    case 'SELECT_TABLE':
      return {
        ...state,
        selectedTable: action.payload,
        // Clear cart when changing tables (optional: could load existing order)
        cart: [],
      };

    case 'CLEAR_TABLE':
      return {
        ...state,
        selectedTable: null,
        cart: [],
      };

    // Cart actions
    case 'ADD_TO_CART': {
      const existingIndex = state.cart.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.portion.id === action.payload.portion.id &&
          JSON.stringify(item.extras) ===
            JSON.stringify(action.payload.extras) &&
          item.note === action.payload.note
      );

      if (existingIndex >= 0) {
        // Increase quantity of existing item
        const updatedCart = [...state.cart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity:
            updatedCart[existingIndex].quantity + action.payload.quantity,
        };
        return { ...state, cart: updatedCart };
      }

      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    }

    case 'UPDATE_CART_ITEM': {
      const updatedCart = state.cart.map((item) =>
        item.id === action.payload.id
          ? { ...item, ...action.payload.updates }
          : item
      );
      return { ...state, cart: updatedCart };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };

    case 'INCREMENT_QUANTITY': {
      const updatedCart = state.cart.map((item) =>
        item.id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      return { ...state, cart: updatedCart };
    }

    case 'DECREMENT_QUANTITY': {
      const updatedCart = state.cart
        .map((item) =>
          item.id === action.payload
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0);
      return { ...state, cart: updatedCart };
    }

    // Navigation actions
    case 'SET_ACTIVE_ZONE':
      return { ...state, activeZone: action.payload };

    case 'SET_ACTIVE_CATEGORY':
      return { ...state, activeCategory: action.payload };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    // Modal actions
    case 'OPEN_PRODUCT_MODAL':
      return {
        ...state,
        isModalOpen: true,
        modalProduct: action.payload,
      };

    case 'CLOSE_MODAL':
      return {
        ...state,
        isModalOpen: false,
        modalProduct: null,
      };

    // UI actions
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };

    case 'SHOW_NOTIFICATION':
      return { ...state, notification: action.payload };

    case 'CLEAR_NOTIFICATION':
      return { ...state, notification: null };

    default:
      return state;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface POSContextType {
  state: POSState;

  // Table actions
  selectTable: (table: Table) => void;
  clearTable: () => void;

  // Cart actions
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateCartItem: (id: string, updates: Partial<CartItem>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;

  // Navigation actions
  setActiveZone: (zone: ZoneId) => void;
  setActiveCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;

  // Modal actions
  openProductModal: (product: Product) => void;
  closeModal: () => void;

  // UI actions
  setProcessing: (processing: boolean) => void;
  showNotification: (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string
  ) => void;
  clearNotification: () => void;

  // Computed values
  subtotal: number;
  taxAmount: number;
  total: number;
  itemCount: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT & PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════

const POSContext = createContext<POSContextType | undefined>(undefined);

interface POSProviderProps {
  children: ReactNode;
}

export function POSProvider({ children }: POSProviderProps) {
  const [state, dispatch] = useReducer(posReducer, initialState);

  // ─────────────────────────────────────────────────────────────────────────────
  // Table Actions
  // ─────────────────────────────────────────────────────────────────────────────

  const selectTable = useCallback((table: Table) => {
    dispatch({ type: 'SELECT_TABLE', payload: table });
  }, []);

  const clearTable = useCallback(() => {
    dispatch({ type: 'CLEAR_TABLE' });
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Cart Actions
  // ─────────────────────────────────────────────────────────────────────────────

  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    const cartItem: CartItem = {
      ...item,
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
  }, []);

  const updateCartItem = useCallback(
    (id: string, updates: Partial<CartItem>) => {
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { id, updates } });
    },
    []
  );

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const incrementQuantity = useCallback((id: string) => {
    dispatch({ type: 'INCREMENT_QUANTITY', payload: id });
  }, []);

  const decrementQuantity = useCallback((id: string) => {
    dispatch({ type: 'DECREMENT_QUANTITY', payload: id });
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Navigation Actions
  // ─────────────────────────────────────────────────────────────────────────────

  const setActiveZone = useCallback((zone: ZoneId) => {
    dispatch({ type: 'SET_ACTIVE_ZONE', payload: zone });
  }, []);

  const setActiveCategory = useCallback((category: string) => {
    dispatch({ type: 'SET_ACTIVE_CATEGORY', payload: category });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Modal Actions
  // ─────────────────────────────────────────────────────────────────────────────

  const openProductModal = useCallback((product: Product) => {
    dispatch({ type: 'OPEN_PRODUCT_MODAL', payload: product });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // UI Actions
  // ─────────────────────────────────────────────────────────────────────────────

  const setProcessing = useCallback((processing: boolean) => {
    dispatch({ type: 'SET_PROCESSING', payload: processing });
  }, []);

  const showNotification = useCallback(
    (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
      dispatch({
        type: 'SHOW_NOTIFICATION',
        payload: { type, message },
      });

      // Auto-clear notification after 3 seconds
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 3000);
    },
    []
  );

  const clearNotification = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATION' });
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Computed Values
  // ─────────────────────────────────────────────────────────────────────────────

  const subtotal = useMemo(() => {
    return state.cart.reduce((sum, item) => {
      const extrasTotal = item.extras.reduce((e, extra) => e + extra.price, 0);
      return sum + (item.unitPrice + extrasTotal) * item.quantity;
    }, 0);
  }, [state.cart]);

  const taxAmount = useMemo(() => {
    return subtotal * TAX_RATE;
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + taxAmount;
  }, [subtotal, taxAmount]);

  const itemCount = useMemo(() => {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.cart]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Context Value
  // ─────────────────────────────────────────────────────────────────────────────

  const value: POSContextType = useMemo(
    () => ({
      state,

      // Table actions
      selectTable,
      clearTable,

      // Cart actions
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      incrementQuantity,
      decrementQuantity,

      // Navigation actions
      setActiveZone,
      setActiveCategory,
      setSearchQuery,

      // Modal actions
      openProductModal,
      closeModal,

      // UI actions
      setProcessing,
      showNotification,
      clearNotification,

      // Computed values
      subtotal,
      taxAmount,
      total,
      itemCount,
    }),
    [
      state,
      selectTable,
      clearTable,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      incrementQuantity,
      decrementQuantity,
      setActiveZone,
      setActiveCategory,
      setSearchQuery,
      openProductModal,
      closeModal,
      setProcessing,
      showNotification,
      clearNotification,
      subtotal,
      taxAmount,
      total,
      itemCount,
    ]
  );

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export function usePOS() {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SELECTOR HOOKS (Performance optimization)
// ═══════════════════════════════════════════════════════════════════════════════

export function usePOSCart() {
  const {
    state,
    addToCart,
    removeFromCart,
    clearCart,
    incrementQuantity,
    decrementQuantity,
    updateCartItem,
  } = usePOS();
  return {
    cart: state.cart,
    addToCart,
    removeFromCart,
    clearCart,
    incrementQuantity,
    decrementQuantity,
    updateCartItem,
  };
}

export function usePOSTable() {
  const { state, selectTable, clearTable } = usePOS();
  return {
    selectedTable: state.selectedTable,
    selectTable,
    clearTable,
  };
}

export function usePOSNavigation() {
  const { state, setActiveZone, setActiveCategory, setSearchQuery } = usePOS();
  return {
    activeZone: state.activeZone,
    activeCategory: state.activeCategory,
    searchQuery: state.searchQuery,
    setActiveZone,
    setActiveCategory,
    setSearchQuery,
  };
}

export function usePOSModal() {
  const { state, openProductModal, closeModal } = usePOS();
  return {
    isModalOpen: state.isModalOpen,
    modalProduct: state.modalProduct,
    openProductModal,
    closeModal,
  };
}

export function usePOSTotals() {
  const { subtotal, taxAmount, total, itemCount } = usePOS();
  return { subtotal, taxAmount, total, itemCount };
}
