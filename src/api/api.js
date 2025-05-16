import axios from 'axios';

export const API_URL = 'http://localhost:8000/api/v1';
export const SERVER_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const isLoginPage = window.location.pathname === '/login';
      if (!isLoginPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const productApi = {
  getProducts: async (page = 1, perPage = 12, query = '', categoryId = null, brandId = null) => {
    try {
      let url = `/products?page=${page}&per_page=${perPage}`;
      
      if (query) url += `&query=${encodeURIComponent(query)}`;
      if (categoryId) url += `&category_id=${categoryId}`;
      if (brandId) url += `&brand_id=${brandId}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  getProductDetail: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
};

export const categoryApi = {
  getCategories: async () => {
    try {
      const response = await api.get('/categories?per_page=100');
      return response.data.items;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};

export const brandApi = {
  getBrands: async () => {
    try {
      const response = await api.get('/brands?per_page=100');
      return response.data.items;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  }
};

export const orderApi = {
  getOrders: async (status = null) => {
    try {
      let url = '/orders/history';
      if (status) url += `?status=${status}`;
      
      const response = await api.get(url);
      return response.data.items;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
  
  getOrderDetail: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },
  
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  cancelOrder: async (orderId) => {
    try {
      const response = await api.post(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error canceling order ${orderId}:`, error);
      throw error;
    }
  }
};