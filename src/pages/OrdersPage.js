import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { api } from '../api/api';
import { useAuth } from '../contexts/AuthContext';

// Функция для отображения статуса заказа
const getOrderStatusInfo = (status) => {
  const statusMap = {
    'cart': { label: 'Корзина', color: 'default' },
    'new': { label: 'Новый', color: 'info' },
    'processing': { label: 'В обработке', color: 'primary' },
    'shipped': { label: 'Отправлен', color: 'secondary' },
    'delivered': { label: 'Доставлен', color: 'success' },
    'canceled': { label: 'Отменен', color: 'error' }
  };
  
  return statusMap[status] || { label: status, color: 'default' };
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Загрузка заказов
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated()) {
        navigate('/login');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const status = tabValue === 1 ? 'delivered' : 
                       tabValue === 2 ? 'canceled' : null;
        
        const response = await api.get('/orders/history', {
          params: { status }
        });
        
        setOrders(response.data.items || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Не удалось загрузить историю заказов');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [navigate, isAuthenticated, tabValue]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };
  
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Мои заказы
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Все заказы" />
          <Tab label="Завершенные" />
          <Tab label="Отмененные" />
        </Tabs>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              У вас нет заказов
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Перейдите в каталог, чтобы сделать первый заказ
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShoppingCartIcon />}
              onClick={() => navigate('/products')}
            >
              Перейти к покупкам
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>№ заказа</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Сумма</TableCell>
                  <TableCell>Товары</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => {
                  const statusInfo = getOrderStatusInfo(order.status);
                  return (
                    <TableRow
                      key={order.id}
                      hover
                      onClick={() => handleOrderClick(order.id)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{order.id}</TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusInfo.label}
                          color={statusInfo.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {order.total_amount.toLocaleString('ru-RU')} ₽
                      </TableCell>
                      <TableCell>
                        {order.items && order.items.length > 0
                          ? `${order.items.length} шт.`
                          : 'Нет товаров'}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderClick(order.id);
                          }}
                        >
                          Подробнее
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default OrdersPage;