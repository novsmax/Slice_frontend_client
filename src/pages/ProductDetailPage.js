import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Skeleton,
  IconButton,
  Tabs,
  Tab,
  TextField
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { api, SERVER_URL } from '../api/api';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBkeT0iLjM1ZW0iPtCd0LXRgiDRhNC+0YLQvjwvdGV4dD48L3N2Zz4=';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/products/${id}`);
        const productData = response.data;
        
        console.log('Product data:', productData);
        
        setProduct(productData);

        if (productData.images && productData.images.length > 0) {
          const primaryImage = productData.images.find(img => img.is_primary) || productData.images[0];
          setSelectedImage(primaryImage);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Не удалось загрузить информацию о товаре');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getImageUrl = (image) => {
    if (imageUrls[image.id]) {
      return imageUrls[image.id];
    }
    
    if (!image.image_url) {
      return PLACEHOLDER_IMAGE;
    }
    
    try {
      const fullUrl = image.image_url.startsWith('http')
        ? image.image_url
        : `${SERVER_URL}${image.image_url.startsWith('/') ? image.image_url : '/' + image.image_url}`;
      
      setImageUrls(prev => ({
        ...prev,
        [image.id]: fullUrl
      }));
      
      return fullUrl;
    } catch (err) {
      console.error('Error processing image URL:', err);
      return PLACEHOLDER_IMAGE;
    }
  };

  const handleImageError = (imageId) => {
    console.log(`Image loading failed for ID: ${imageId}, using placeholder`);
    
    setImageUrls(prev => ({
      ...prev,
      [imageId]: PLACEHOLDER_IMAGE
    }));
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(Math.min(value, product?.stock || 1));
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" width="100%" height={400} />
            <Box sx={{ display: 'flex', mt: 2 }}>
              {[1, 2, 3, 4].map((item) => (
                <Skeleton key={item} variant="rectangular" width={80} height={80} sx={{ mr: 1 }} />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={60} width="80%" />
            <Skeleton variant="text" height={30} width="50%" sx={{ mb: 2 }} />
            <Skeleton variant="text" height={40} width="30%" sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={100} width="100%" sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={50} width="100%" />
          </Grid>
        </Grid>
      </Container>
    );
  }

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

  if (!product) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Товар не найден
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/products')}
        >
          Вернуться к списку товаров
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      {/* Навигация */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Вернуться назад
      </Button>

      <Grid container spacing={4}>
        {/* Изображения товара */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={1}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
              minHeight: 400,
              backgroundColor: '#f5f5f5'
            }}
          >
            {selectedImage ? (
              <Box
                component="img"
                src={imageUrls[selectedImage.id] || getImageUrl(selectedImage)}
                alt={selectedImage.alt_text || product.name}
                sx={{
                  maxWidth: '100%',
                  maxHeight: 400,
                  objectFit: 'contain'
                }}
                onError={() => handleImageError(selectedImage.id)}
              />
            ) : (
              <Typography variant="body1" color="text.secondary">
                Изображение отсутствует
              </Typography>
            )}
          </Paper>

          {/* Миниатюры изображений */}
          {product.images && product.images.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                mt: 2,
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                  height: 8
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderRadius: 4
                }
              }}
            >
              {product.images.map((image) => (
                <Box
                  key={image.id}
                  component="img"
                  src={imageUrls[image.id] || getImageUrl(image)}
                  alt={image.alt_text || 'Thumbnail'}
                  onClick={() => handleImageSelect(image)}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'contain',
                    mr: 1,
                    cursor: 'pointer',
                    border: selectedImage?.id === image.id ? '2px solid #724242' : '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 1,
                    backgroundColor: '#f5f5f5'
                  }}
                  onError={() => handleImageError(image.id)}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Информация о товаре */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>

          {/* Бренд и категория */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {product.brand && (
              <Chip label={`Бренд: ${product.brand.name}`} size="small" />
            )}
            {product.category && (
              <Chip label={`Категория: ${product.category.name}`} size="small" />
            )}
            {product.sku && (
              <Chip label={`SKU: ${product.sku}`} size="small" />
            )}
          </Box>

          {/* Цена и наличие */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" color="primary" gutterBottom>
              {product.price.toLocaleString('ru-RU')} ₽
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
              {product.stock > 0 ? (
                <>
                  <Chip
                    label="В наличии"
                    color="success"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <span>Доступно: {product.stock} шт.</span>
                </>
              ) : (
                <Chip
                  label="Нет в наличии"
                  color="error"
                  size="small"
                />
              )}
            </Typography>
          </Box>

          {/* Добавление в корзину */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TextField
              type="number"
              label="Количество"
              value={quantity}
              onChange={handleQuantityChange}
              InputProps={{ inputProps: { min: 1, max: product.stock } }}
              sx={{ width: 100, mr: 2 }}
              disabled={product.stock <= 0}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={cartLoading || product.stock <= 0}
              size="large"
            >
              {cartLoading ? <CircularProgress size={24} /> : 'В корзину'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Вкладки с информацией */}
          <Box sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Описание" />
              <Tab label="Характеристики" />
            </Tabs>
            
            <Box sx={{ p: 2 }}>
              {tabValue === 0 && (
                <Typography variant="body1">
                  {product.description || 'Описание отсутствует'}
                </Typography>
              )}
              {tabValue === 1 && (
                <Typography variant="body1">
                  Характеристики товара скоро будут добавлены
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;