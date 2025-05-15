import React, { useState } from 'react';
import { 
  TableRow, 
  TableCell, 
  IconButton, 
  TextField, 
  Typography, 
  Box,
  ButtonGroup,
  Button
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Add as AddIcon, 
  Remove as RemoveIcon
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleUpdateQuantity = async () => {
    if (quantity !== item.quantity) {
      try {
        setLoading(true);
        await updateCartItem(item.id, quantity);
      } catch (error) {
        console.error('Error updating cart item:', error);
        setQuantity(item.quantity); // Reset on error
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveItem = async () => {
    try {
      setLoading(true);
      await removeFromCart(item.id);
    } catch (error) {
      console.error('Error removing cart item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateCartItem(item.id, newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateCartItem(item.id, newQuantity);
    }
  };

  const itemTotal = (item.price * quantity).toLocaleString('ru-RU');

  return (
    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
      <TableCell>
        <Typography variant="body1">
          {item.product_name}
        </Typography>
      </TableCell>
      <TableCell align="right">
        {item.price.toLocaleString('ru-RU')} ₽
      </TableCell>
      <TableCell align="center">
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <Button 
              onClick={handleDecrement}
              disabled={loading || quantity <= 1}
              sx={{ 
                minWidth: '40px',
                height: '36px',
                borderRadius: 0,
                borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                padding: 0
              }}
            >
              <RemoveIcon fontSize="small" />
            </Button>
            
            <TextField
              size="small"
              value={quantity}
              onChange={handleQuantityChange}
              onBlur={handleUpdateQuantity}
              sx={{ 
                width: '50px',
                '& .MuiOutlinedInput-root': {
                  height: '36px',
                  '& fieldset': {
                    border: 'none',
                  },
                  '& input': { 
                    textAlign: 'center', 
                    padding: '8px 0',
                    fontWeight: 'medium'
                  }
                },
                '& .MuiInputBase-root': {
                  borderRadius: 0
                }
              }}
              inputProps={{ 
                min: 1, 
                style: { 
                  textAlign: 'center',
                  fontSize: '15px'
                }
              }}
            />
            
            <Button 
              onClick={handleIncrement} 
              disabled={loading}
              sx={{ 
                minWidth: '40px',
                height: '36px',
                borderRadius: 0,
                borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                padding: 0
              }}
            >
              <AddIcon fontSize="small" />
            </Button>
          </Box>
        </Box>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body1" fontWeight="bold">
          {itemTotal} ₽
        </Typography>
      </TableCell>
      <TableCell align="right">
        <IconButton 
          edge="end" 
          size="small" 
          color="error"
          onClick={handleRemoveItem}
          disabled={loading}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default CartItem;