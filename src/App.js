import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';

import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import NotFoundPage from './pages/NotFoundPage';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              minHeight: '100vh' 
            }}>
              <Navbar />
              <Box sx={{ flexGrow: 1 }}>
                <Routes>
                  {/* Публичные маршруты - доступны всем без авторизации */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/products" element={<CatalogPage />} /> {/* Публичный маршрут */}
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  
                  {/* Защищенные маршруты (требуют авторизации) */}
                  <Route 
                    path="/cart" 
                    element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/orders" 
                    element={
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/orders/:id" 
                    element={
                      <ProtectedRoute>
                        <OrderDetailPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Обработка 404 и редиректы */}
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;