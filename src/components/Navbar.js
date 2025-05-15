import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box, Container, Avatar, Menu, MenuItem } from '@mui/material';
import { 
  ShoppingCart as ShoppingCartIcon, 
  PersonOutline as PersonIcon, 
  Store as StoreIcon 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer'
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
          {/* Логотип и название с иконкой */}
          <Logo onClick={() => navigate('/')}>
            <StoreIcon sx={{ fontSize: 28, mr: 1 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 'bold', letterSpacing: 1 }}
            >
              SLICE
            </Typography>
          </Logo>
          
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
            <IconButton 
              color="inherit" 
              onClick={() => navigate('/cart')}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
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