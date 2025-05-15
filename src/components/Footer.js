import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        px: 2, 
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.mode === 'light' ? '#724242' : '#121212',
        color: 'white'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: { xs: 'center', md: 'flex-start' },
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2
        }}>
          {/* Логотип и информация о компании */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: 350 }}>
            <Typography variant="h6" gutterBottom>
              SLICE
            </Typography>
            <Typography variant="body2">
              Slice - ваш надежный магазин электроники. Мы предлагаем широкий ассортимент товаров от ведущих производителей по приятным ценам.
            </Typography>
          </Box>
          
          {/* Навигация */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="subtitle1" gutterBottom>
              Навигация
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Главная
            </Link>
            <Link component={RouterLink} to="/products" color="inherit" display="block" sx={{ mb: 1 }}>
              Каталог
            </Link>
            <Link component={RouterLink} to="/cart" color="inherit" display="block" sx={{ mb: 1 }}>
              Корзина
            </Link>
            <Link component={RouterLink} to="/orders" color="inherit" display="block">
              Мои заказы
            </Link>
          </Box>
          
          {/* Категории */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="subtitle1" gutterBottom>
              Категории
            </Typography>
            <Link component={RouterLink} to="/products?category=1" color="inherit" display="block" sx={{ mb: 1 }}>
              Смартфоны
            </Link>
            <Link component={RouterLink} to="/products?category=2" color="inherit" display="block" sx={{ mb: 1 }}>
              Ноутбуки
            </Link>
            <Link component={RouterLink} to="/products?category=3" color="inherit" display="block" sx={{ mb: 1 }}>
              Планшеты
            </Link>
            <Link component={RouterLink} to="/products?category=4" color="inherit" display="block">
              Аксессуары
            </Link>
          </Box>
          
          {/* Контакты */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="subtitle1" gutterBottom>
              Контакты
            </Typography>
            <Typography variant="body2" gutterBottom>
              Тел: +7 (123) 456-78-90
            </Typography>
            <Typography variant="body2" gutterBottom>
              Email: info@slice.com
            </Typography>
            <Typography variant="body2">
              Адрес: г. Москва, ул. Примерная, д. 1
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mt: 3, borderTop: '1px solid rgba(255,255,255,0.2)', pt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} Slice. Все права защищены.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;