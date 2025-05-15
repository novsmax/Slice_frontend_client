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

  const imageUrl = item.product_id && item.product_image 
    ? (item.product_image.startsWith('http') 
      ? item.product_image 
      : `${process.env.REACT_APP_API_BASE_URL}${item.product_image}`)
    : 'https://via.placeholder.com/50x50?text=No+Image';

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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            sx={{
              width: 50,
              height: 50,
              objectFit: 'contain',
              mr: 2,
              borderRadius: 1
            }}
            src={imageUrl}
            alt={item.product_name}
          />
          <Typography variant="body1">
            {item.product_name}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="right">
        {item.price.toLocaleString('ru-RU')} ₽
      </TableCell>
      <TableCell align="center">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ButtonGroup size="small" variant="outlined">
            <Button 
              onClick={handleDecrement}
              disabled={loading || quantity <= 1}
            >
              <RemoveIcon fontSize="small" />
            </Button>
            <TextField
              size="small"
              value={quantity}
              onChange={handleQuantityChange}
              onBlur={handleUpdateQuantity}
              sx={{ width: '60px', '& input': { textAlign: 'center' } }}
              inputProps={{ min: 1, style: { padding: '4px', textAlign: 'center' } }}
            />
            <Button onClick={handleIncrement} disabled={loading}>
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