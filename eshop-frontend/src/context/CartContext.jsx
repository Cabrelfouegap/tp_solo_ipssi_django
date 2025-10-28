import React, { createContext, useReducer } from 'react';

// Actions pour le reducer du panier
export const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Reducer pour gérer l'état du panier
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Si le produit existe déjà, augmenter la quantité
        const updatedItems = state.items.map(item =>
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total_items: state.total_items + quantity,
          total_price: state.total_price + (product.price * quantity)
        };
      } else {
        // Nouveau produit
        const newItem = { product, quantity };
        return {
          ...state,
          items: [...state.items, newItem],
          total_items: state.total_items + quantity,
          total_price: state.total_price + (product.price * quantity)
        };
      }
    }
    
    case CART_ACTIONS.UPDATE_ITEM: {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product.id === productId);
      
      if (!item) return state;
      
      const quantityDiff = quantity - item.quantity;
      const updatedItems = state.items.map(item =>
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      );
      
      return {
        ...state,
        items: updatedItems,
        total_items: state.total_items + quantityDiff,
        total_price: state.total_price + (item.product.price * quantityDiff)
      };
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      const { productId } = action.payload;
      const item = state.items.find(item => item.product.id === productId);
      
      if (!item) return state;
      
      const updatedItems = state.items.filter(item => item.product.id !== productId);
      return {
        ...state,
        items: updatedItems,
        total_items: state.total_items - item.quantity,
        total_price: state.total_price - (item.product.price * item.quantity)
      };
    }
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        total_items: 0,
        total_price: 0
      };
    
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    default:
      return state;
  }
};

// État initial du panier
const initialCartState = {
  items: [],
  total_items: 0,
  total_price: 0,
  loading: false,
  error: null
};

// Création du contexte
const CartContext = createContext();

// Provider du contexte MINIMAL (sans API)
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  console.log('CartProvider: Initialisation du panier local...');

  // Fonctions pour gérer le panier (en mémoire uniquement)
  const addToCart = (product, quantity = 1) => {
    console.log('CartProvider: Ajout au panier', { product: product.name, quantity });
    dispatch({ 
      type: CART_ACTIONS.ADD_ITEM, 
      payload: { product, quantity } 
    });
    return { success: true, message: `${product.name} ajouté au panier` };
  };

  const updateCartItem = (productId, quantity) => {
    console.log('CartProvider: Mise à jour quantité', { productId, quantity });
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    dispatch({ 
      type: CART_ACTIONS.UPDATE_ITEM, 
      payload: { productId, quantity } 
    });
    return { success: true, message: 'Quantité mise à jour' };
  };

  const removeFromCart = (productId) => {
    console.log('CartProvider: Suppression du panier', { productId });
    dispatch({ 
      type: CART_ACTIONS.REMOVE_ITEM, 
      payload: { productId } 
    });
    return { success: true, message: 'Produit retiré du panier' };
  };

  const clearCart = () => {
    console.log('CartProvider: Vidage du panier');
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    return { success: true, message: 'Panier vidé' };
  };

  const clearError = () => {
    dispatch({ type: CART_ACTIONS.SET_ERROR, payload: null });
  };

  // Valeurs du contexte
  const value = {
    cart: {
      items: state.items,
      total_items: state.total_items,
      total_price: state.total_price,
      is_empty: state.items.length === 0
    },
    loading: state.loading,
    error: state.error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    clearError
  };

  console.log('CartProvider: État actuel:', value.cart);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;