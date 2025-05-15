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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ButtonGroup 
            variant="outlined" 
            aria-label="quantity control"
            sx={{ 
              '& .MuiButtonGroup-grouped': {
                minWidth: '35px',
                height: '35px',
                borderRadius: '4px !important'
              }
            }}
          >
            <Button 
              onClick={handleDecrement}
              disabled={loading || quantity <= 1}
              sx={{ 
                borderRadius: '50% 0 0 50%',
                padding: 1,
                minWidth: '35px',
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
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
                  height: '35px',
                  '& fieldset': {
                    border: 'none',
                    borderTop: '1px solid rgba(0, 0, 0, 0.23)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.23)',
                  },
                  '& input': { 
                    textAlign: 'center', 
                    padding: '4px 0',
                    fontWeight: 'bold'
                  }
                }
              }}
              inputProps={{ 
                min: 1, 
                style: { textAlign: 'center' }
              }}
            />
            <Button 
              onClick={handleIncrement} 
              disabled={loading}
              sx={{ 
                borderRadius: '0 50% 50% 0',
                padding: 0,
                minWidth: '35px',
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <AddIcon fontSize="small" />
            </Button>
          </ButtonGroup>
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