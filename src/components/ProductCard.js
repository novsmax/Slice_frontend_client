import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { api } from '../api/api';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBkeT0iLjM1ZW0iPtCd0LXRgiDRhNC+0YLQvjwvdGV4dD48L3N2Zz4=';

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();
  const [imageUrl, setImageUrl] = useState(PLACEHOLDER_IMAGE);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!product || !product.id) return;
      
      try {
        const response = await api.get(`/products/${product.id}`);
        
        if (response.data.images && response.data.images.length > 0) {
          const mainImage = response.data.images.find(img => img.is_primary) || response.data.images[0];
          
          if (mainImage && mainImage.image_url) {
            const fullImageUrl = mainImage.image_url.startsWith('http') 
              ? mainImage.image_url 
              : `http://localhost:8000${mainImage.image_url.startsWith('/') ? mainImage.image_url : '/' + mainImage.image_url}`;
            
            setImageUrl(fullImageUrl);
          }
        }
      } catch (error) {
        console.error(`Error fetching details for product ${product.id}:`, error);
      }
    };

    fetchProductDetails();
  }, [product]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleImageError = () => {
    if (imageUrl !== PLACEHOLDER_IMAGE) {
      console.log(`Failed to load image for product ${product.name}. Using placeholder.`);
      setImageUrl(PLACEHOLDER_IMAGE);
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
          onError={handleImageError}
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