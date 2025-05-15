import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Divider,
  TextField,
  Grid
} from '@mui/material';
import { ShoppingCart as ShoppingCartIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartItem from '../components/CartItem';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loading, error, clearCart, checkout } = useCart();
  const { currentUser, isAuthenticated } = useAuth();
  
  const [orderData, setOrderData] = useState({
    shipping_address: '',
    phone_number: '',
    notes: ''
  });
  
  const [orderErrors, setOrderErrors] = useState({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData({
      ...orderData,
      [name]: value
    });
    
    if (orderErrors[name]) {
      setOrderErrors({
        ...orderErrors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!orderData.shipping_address.trim()) {
      errors.shipping_address = 'Адрес доставки обязателен';
    }
    
    if (!orderData.phone_number.trim()) {
      errors.phone_number = 'Номер телефона обязателен';
    } else if (!/^\+?[0-9]{10,15}$/.test(orderData.phone_number.replace(/\s/g, ''))) {
      errors.phone_number = 'Введите корректный номер телефона';
    }
    
    setOrderErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleCheckout = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setCheckoutLoading(true);
      setCheckoutError(null);
      
      const result = await checkout(orderData);
      
      setCheckoutSuccess(true);
      
      setTimeout(() => {
        navigate(`/orders/${result.id}`);
      }, 2000);
      
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError(err.message || 'Ошибка оформления заказа');
    } finally {
      setCheckoutLoading(false);
    }
  };
  
  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };
  
  if (!loading && (!cart || !cart.items || cart.items.length === 0)) {
    return (
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Ваша корзина пуста
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Добавьте товары в корзину, чтобы продолжить покупки
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/products')}
          >
            Перейти к каталогу
          </Button>
        </Paper>
      </Box>
    );
  }
  
  return (
    <Box sx={{ py: 4 }} padding={3}>
      {/* Выровненный заголовок с иконкой */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ShoppingCartIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          Корзина
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Если успешно оформили заказ */}
      {checkoutSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Заказ успешно оформлен! Вы будете перенаправлены на страницу заказа...
        </Alert>
      )}
      
      {/* Если ошибка оформления */}
      {checkoutError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {checkoutError}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Таблица товаров */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: { xs: 3, md: 0 } }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Товар</TableCell>
                      <TableCell align="right">Цена</TableCell>
                      <TableCell align="center">Количество</TableCell>
                      <TableCell align="right">Сумма</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.items.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleClearCart}
                  disabled={loading}
                >
                  Очистить корзину
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Сводка и оформление заказа */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Сводка заказа
              </Typography>
              
              <Box sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Товары ({cart.items.length}):</Typography>
                  <Typography variant="body1">
                    {cart.total_amount.toLocaleString('ru-RU')} ₽
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Итого:</Typography>
                  <Typography variant="h6" color="primary">
                    {cart.total_amount.toLocaleString('ru-RU')} ₽
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Форма оформления заказа */}
              {isAuthenticated() ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    Оформление заказа
                  </Typography>
                  
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Адрес доставки"
                    name="shipping_address"
                    value={orderData.shipping_address}
                    onChange={handleInputChange}
                    error={!!orderErrors.shipping_address}
                    helperText={orderErrors.shipping_address}
                    required
                  />
                  
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Номер телефона"
                    name="phone_number"
                    value={orderData.phone_number}
                    onChange={handleInputChange}
                    error={!!orderErrors.phone_number}
                    helperText={orderErrors.phone_number}
                    required
                  />
                  
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Комментарий к заказу"
                    name="notes"
                    multiline
                    rows={3}
                    value={orderData.notes}
                    onChange={handleInputChange}
                  />
                  
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleCheckout}
                    disabled={checkoutLoading || cart.items.length === 0}
                    sx={{ mt: 3 }}
                  >
                    {checkoutLoading ? <CircularProgress size={24} /> : 'Оформить заказ'}
                  </Button>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    Для оформления заказа необходимо войти в систему
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/login')}
                    sx={{ mt: 1 }}
                  >
                    Войти
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default CartPage;