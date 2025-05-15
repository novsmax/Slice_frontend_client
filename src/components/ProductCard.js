import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Rating, Box } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();

  const mainImage = product.images && product.images.length > 0
    ? product.images.find(img => img.is_primary) || product.images[0]
    : null;

  const imageUrl = mainImage
    ? (mainImage.image_url.startsWith('http')
      ? mainImage.image_url
      : `${process.env.REACT_APP_API_BASE_URL}${mainImage.image_url}`)
    : 'https://via.placeholder.com/300x200?text=Нет+изображения';

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt={product.name}
          sx={{ 
            objectFit: 'contain',
            backgroundColor: '#f5f5f5',
            padding: '1rem'
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 1
          }}>
            {product.description || 'Описание отсутствует'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Typography variant="h6" color="primary">
              {product.price.toLocaleString('ru-RU')} ₽
            </Typography>
            {product.stock > 0 ? (
              <Typography variant="caption" color="success.main">
                В наличии
              </Typography>
            ) : (
              <Typography variant="caption" color="error">
                Нет в наличии
              </Typography>
            )}
          </Box>
        </CardContent>
      </Link>
      <CardActions>
        <Button 
          fullWidth 
          variant="contained" 
          color="primary" 
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={loading || product.stock <= 0}
        >
          В корзину
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;