import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Paper,
  Grid
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import HomeAdvantages from '../components/HomeAdvantages';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box>
      <Box 
        sx={{ 
          py: { xs: 6, md: 10 }, 
          textAlign: 'center',
          background: 'linear-gradient(180deg, #ffdcd1 0%, rgba(255, 220, 209, 0.4) 100%)',
          borderRadius: { xs: 0, md: '0 0 30px 30px' },
          mb: 6
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: '#724242',
              mb: 2,
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }
            }}
          >
            SLICE
          </Typography>
          
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              color: '#724242',
              mb: 2
            }}
          >
            Техника для современной жизни
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto', 
              mb: 6, 
              color: '#724242',
              fontSize: { xs: '1rem', md: '1.1rem' }
            }}
          >
            Высококачественная электроника от ведущих мировых производителей по доступным ценам
          </Typography>
          
          {/* Строка поиска */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 4,
              mx: 'auto',
              maxWidth: 700,
              px: 2
            }}
          >
            <TextField
              placeholder="Поиск товаров..."
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              sx={{ 
                width: '100%',
                backgroundColor: 'white',
                borderRadius: 10,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 10,
                  '&:hover fieldset': {
                    borderColor: '#724242',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#724242',
                  },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSearch}
                    sx={{ 
                      borderRadius: '0 26px 26px 0', 
                      height: '100%', 
                      position: 'absolute', 
                      right: 0,
                      px: 3
                    }}
                  >
                    Найти
                  </Button>
                )
              }}
            />
          </Box>
          
          {/* Кнопка перехода в каталог */}
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/products')}
            sx={{ 
              mt: 2,
              borderRadius: 3,
              px: 3,
              py: 1
            }}
          >
            Перейти в каталог
          </Button>
        </Container>
      </Box>
      
      {/* Компонент преимуществ */}
      <HomeAdvantages />
    </Box>
  );
};

export default HomePage;