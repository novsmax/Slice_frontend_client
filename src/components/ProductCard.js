import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

// Локальная заглушка изображения, которая точно загрузится
// Base64-encoded пустое изображение с текстом "Нет фото"
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBkeT0iLjM1ZW0iPtCd0LXRgiDRhNC+0YLQvjwvdGV4dD48L3N2Zz4=';

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();

  // Находим основное изображение — либо то, которое помечено как primary, либо первое
  const mainImage = product.images && product.images.length > 0
    ? product.images.find(img => img.is_primary) || product.images[0]
    : null;

  // По умолчанию используем локальную заглушку
  const [imageUrl, setImageUrl] = React.useState(PLACEHOLDER_IMAGE);

  // Устанавливаем URL изображения после монтирования компонента
  React.useEffect(() => {
    if (mainImage && mainImage.image_url) {
      setImageUrl(mainImage.image_url);
    }
  }, [mainImage]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Обработчик ошибки загрузки изображения
  const handleImageError = () => {
    // Устанавливаем локальную заглушку и не пытаемся загружать снова
    if (imageUrl !== PLACEHOLDER_IMAGE) {
      console.log(`Не удалось загрузить изображение для товара ${product.name}. Использую заглушку.`);
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