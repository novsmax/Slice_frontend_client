import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box, Container, Avatar, Menu, MenuItem } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon, PersonOutline as PersonIcon, Menu as MenuIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

// Стилизованный логотип
const Logo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    height: 40,
    marginRight: theme.spacing(1)
  }
}));

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { cartItemsCount } = useCart();
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };
  
  return (
    <AppBar position="sticky" color="primary" elevation={1}>
      <Container>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Логотип и название */}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Logo>
              <svg viewBox="0 0 400 300" width="50" height="30" xmlns="http://www.w3.org/2000/svg">
                <g fill="#fff">
                  <path d="M175 120 Q150 120 150 140 Q150 160 170 160 Q185 160 197 150 L195 170 Q180 180 160 180 Q130 180 130 145 Q130 110 170 110 Q180 110 190 115 L185 120 Q180 118 175 120" />
                  <path d="M220 110 L260 110 L260 115 L235 115 L235 140 L255 140 L255 145 L235 145 L235 175 Q235 180 240 180 L260 180 L260 185 L235 185 Q220 185 220 170 L220 110" />
                  <circle cx="320" cy="120" r="8"/>
                </g>
              </svg>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ fontWeight: 'bold', letterSpacing: 1 }}
              >
                SLICE
              </Typography>
            </Logo>
          </Box>
          
          {/* Навигация */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit" onClick={() => navigate('/')}>
              Главная
            </Button>
            <Button color="inherit" onClick={() => navigate('/products')}>
              Каталог
            </Button>
          </Box>
          
          {/* Иконки справа */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={() => navigate('/cart')}>
              <Badge badgeContent={cartItemsCount} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            
            {currentUser ? (
              <>
                <IconButton 
                  color="inherit" 
                  edge="end" 
                  onClick={handleMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {currentUser.username.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                    Профиль
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/orders'); handleMenuClose(); }}>
                    Мои заказы
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" onClick={() => navigate('/login')}>
                Войти
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;