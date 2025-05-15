import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  LocalShipping as ShippingIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { api, API_BASE_URL } from '../api/api';
import { useAuth } from '../contexts/AuthContext';

// Функция для отображения статуса заказа
const getOrderStatusInfo = (status) => {
  const statusMap = {
    'cart': { label: 'Корзина', color: 'default', step: 0 },
    'new': { label: 'Новый', color: 'info', step: 0 },
    'processing': { label: 'В обработке', color: 'primary', step: 1 },
    'shipped': { label: 'Отправлен', color: 'secondary', step: 2 },
    'delivered': { label: 'Доставлен', color: 'success', step: 3 },
    'canceled': { label: 'Отменен', color: 'error', step: -1 }
  };
  
  return statusMap[status] || { label: status, color: 'default', step: 0 };
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Загрузка данных о заказе
  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated()) {
        navigate('/login');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Не удалось загрузить информацию о заказе');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id, navigate, isAuthenticated]);
  
  // Обработчик отмены заказа
  const handleCancelOrder = async () => {
    if (!order || !['new', 'processing'].includes(order.status)) {
      return;
    }
    
    try {
      setLoading(true);
      
      await api.post(`/orders/${id}/cancel`);
      
      // Загружаем обновленную информацию о заказе
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (err) {
      console.error('Error canceling order:', err);
      setError('Не удалось отменить заказ');
    } finally {
      setLoading(false);
    }
  };
  
  // Если загружается
  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  // Если ошибка
  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Вернуться назад
        </Button>
      </Container>
    );
  }
  
  // Если заказ не найден
  if (!order) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Заказ не найден
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/orders')}
        >
          К списку заказов
        </Button>
      </Container>
    );
  }
  
  // Получаем информацию о статусе заказа
  const statusInfo = getOrderStatusInfo(order.status);
  
  // Шаги заказа
  const steps = ['Новый', 'В обработке', 'Отправлен', 'Доставлен'];
  
  return (
    <Container sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/orders')}
        sx={{ mb: 3 }}
      >
        К списку заказов
      </Button>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Заказ №{order.id}
          </Typography>
          <Chip
            label={statusInfo.label}
            color={statusInfo.color}
            size="medium"
          />
        </Box>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Дата заказа
            </Typography>
            <Typography variant="body1">
              {new Date(order.created_at).toLocaleDateString()}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Статус
            </Typography>
            <Typography variant="body1">
              {statusInfo.label}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Сумма заказа
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {order.total_amount.toLocaleString('ru-RU')} ₽
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Дата доставки
            </Typography>
            <Typography variant="body1">
              {order.completed_at ? new Date(order.completed_at).toLocaleDateString() : 'Ожидается'}
            </Typography>
          </Grid>
        </Grid>
        
        {/* Прогресс заказа */}
        {statusInfo.step >= 0 && (
          <Box sx={{ width: '100%', mb: 4 }}>
            <Stepper activeStep={statusInfo.step} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        {/* Детали доставки */}
        <Typography variant="h6" gutterBottom>
          Информация о доставке
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Адрес доставки
              </Typography>
              <Typography variant="body1">
                {order.shipping_address || 'Не указан'}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Контактный телефон
              </Typography>
              <Typography variant="body1">
                {order.phone_number || 'Не указан'}
              </Typography>
            </Paper>
          </Grid>
          
          {order.notes && (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Примечания к заказу
                </Typography>
                <Typography variant="body1">
                  {order.notes}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Товары в заказе */}
        <Typography variant="h6" gutterBottom>
          Товары в заказе
        </Typography>
        
        <Paper variant="outlined" sx={{ mb: 3 }}>
          {order.items.map((item, index) => (
            <React.Fragment key={item.id}>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1">
                    {item.product_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.price.toLocaleString('ru-RU')} ₽ × {item.quantity} шт.
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                  </Typography>
                </Box>
              </Box>
              
              {index < order.items.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Paper>
        
        {/* Итоговая сумма */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          {['new', 'processing'].includes(order.status) && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancelOrder}
                disabled={loading}
              >
                Отменить заказ
              </Button>
            )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ mr: 2 }}>
            Итого:
          </Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {order.total_amount.toLocaleString('ru-RU')} ₽
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderDetailPage;