import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api, SERVER_URL } from '../api/api';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Категории и бренды для фильтров
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(false);
  
  // Состояние для фильтров и поиска
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  
  useEffect(() => {
      const fetchFilters = async () => {
        try {
          setLoadingFilters(true);
          
          const categoriesResponse = await api.get('/categories?per_page=100');
          setCategories(categoriesResponse.data.items || []);
          
          const brandsResponse = await api.get('/brands?per_page=100');
          setBrands(brandsResponse.data.items || []);
        } catch (err) {
          console.error('Error fetching filters:', err);
        } finally {
          setLoadingFilters(false);
        }
      };
      
      fetchFilters();
    }, []);
    
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let url = `/products?page=${currentPage}&per_page=12`;
        
        if (searchQuery) {
          url += `&query=${encodeURIComponent(searchQuery)}`;
        }
        
        if (selectedCategory) {
          url += `&category_id=${selectedCategory}`;
        }
        
        if (selectedBrand) {
          url += `&brand_id=${selectedBrand}`;
        }

        url += `&is_active=true`;
        
        const response = await api.get(url);
        const productsData = response.data.items;
        
        const processedProducts = productsData;
        
        setProducts(processedProducts);
        setTotalPages(response.data.pages || 1);
        
        const params = new URLSearchParams();
        params.set('page', currentPage.toString());
        if (searchQuery) params.set('query', searchQuery);
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedBrand) params.set('brand', selectedBrand);
        setSearchParams(params);
        
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Не удалось загрузить товары');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [currentPage, searchQuery, selectedCategory, selectedBrand, setSearchParams]);
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Скролл наверх при смене страницы
  };
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const handleSearch = () => {
    setCurrentPage(1); // Сбрасываем на первую страницу при поиске
  };
  
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };
  
  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
    setCurrentPage(1);
  };
  
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setCurrentPage(1);
  };
  
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#724242' }}>
        Каталог товаров
      </Typography>
      
      {/* Поиск и фильтры */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Поиск товаров"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Категория</InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Категория"
                disabled={loadingFilters}
              >
                <MenuItem value="">Все категории</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Бренд</InputLabel>
              <Select
                value={selectedBrand}
                onChange={handleBrandChange}
                label="Бренд"
                disabled={loadingFilters}
              >
                <MenuItem value="">Все бренды</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={1}>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              fullWidth
              disabled={!searchQuery && !selectedCategory && !selectedBrand}
            >
              Сбросить
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Сообщение об ошибке */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {/* Список товаров */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Товары не найдены
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Попробуйте изменить параметры поиска или фильтры
          </Typography>
          {(searchQuery || selectedCategory || selectedBrand) && (
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              sx={{ mt: 2 }}
            >
              Сбросить фильтры
            </Button>
          )}
        </Paper>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
          
          {/* Пагинация */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default CatalogPage;