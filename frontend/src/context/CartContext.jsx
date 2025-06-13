import React, { createContext, useContext, useEffect, useState } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext({});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Cargar carrito cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    } else {
      // Limpiar carrito si no está autenticado
      setCartItems([]);
      setTotal(0);
      setItemCount(0);
    }
  }, [isAuthenticated()]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      const { cart_items, total: cartTotal, item_count } = response.data;
      
      setCartItems(cart_items || []);
      setTotal(cartTotal || 0);
      setItemCount(item_count || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
      setTotal(0);
      setItemCount(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const response = await cartAPI.add({ product_id: productId, quantity });
      
      // Refrescar carrito después de agregar
      await fetchCart();
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al agregar al carrito' 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      setLoading(true);
      const response = await cartAPI.update(itemId, { quantity });
      
      // Actualizar item específico en el estado local
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, quantity, total_price: quantity * item.products.price }
            : item
        )
      );
      
      // Recalcular total
      const newTotal = cartItems.reduce((sum, item) => {
        if (item.id === itemId) {
          return sum + (quantity * item.products.price);
        }
        return sum + (item.quantity * item.products.price);
      }, 0);
      
      setTotal(newTotal);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating cart item:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al actualizar carrito' 
      };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      await cartAPI.remove(itemId);
      
      // Remover item del estado local
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      setItemCount(prevCount => prevCount - 1);
      
      // Recalcular total
      const newTotal = cartItems
        .filter(item => item.id !== itemId)
        .reduce((sum, item) => sum + (item.quantity * item.products.price), 0);
      
      setTotal(newTotal);
      
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al eliminar del carrito' 
      };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartAPI.clear();
      
      setCartItems([]);
      setTotal(0);
      setItemCount(0);
      
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al limpiar carrito' 
      };
    } finally {
      setLoading(false);
    }
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.product_id === productId);
  };

  const getCartItemQuantity = (productId) => {
    const item = cartItems.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    total,
    itemCount,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    isInCart,
    getCartItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
