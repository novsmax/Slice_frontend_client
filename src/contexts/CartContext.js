import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка корзины
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Не удалось загрузить корзину');
    } finally {
      setLoading(false);
    }
  };

  // Загружаем корзину при инициализации
  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []);

  // Добавление товара в корзину
  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/cart/items', {
        product_id: productId,
        quantity: quantity
      });
      
      // Обновляем корзину
      await fetchCart();
      
      return response.data;
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err.response?.data?.detail || 'Не удалось добавить товар в корзину');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Обновление товара в корзине
  const updateCartItem = async (itemId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/cart/items/${itemId}`, {
        quantity: quantity
      });
      
      // Обновляем корзину
      await fetchCart();
      
      return response.data;
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError(err.response?.data?.detail || 'Не удалось обновить товар в корзине');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Удаление товара из корзины
  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.delete(`/cart/items/${itemId}`);
      
      // Обновляем корзину
      await fetchCart();
      
      return true;
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError(err.response?.data?.detail || 'Не удалось удалить товар из корзины');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Очистка корзины
  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await api.delete('/cart');
      
      // Обновляем корзину
      await fetchCart();
      
      return true;
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err.response?.data?.detail || 'Не удалось очистить корзину');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Оформление заказа
  const checkout = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/orders', orderData);
      
      // Обновляем корзину
      await fetchCart();
      
      return response.data;
    } catch (err) {
      console.error('Error checking out:', err);
      setError(err.response?.data?.detail || 'Не удалось оформить заказ');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Общее количество товаров в корзине
  const cartItemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Экспортируем значения и функции
  const value = {
    cart,
    loading,
    error,
    cartItemsCount,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    checkout
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Хук для использования контекста корзины
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return context;
};