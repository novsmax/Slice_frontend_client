import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { SentimentDissatisfied as SadIcon } from '@mui/icons-material';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
          minHeight: '60vh'
        }}
      >
        <SadIcon sx={{ fontSize: 100, color: 'primary.main', mb: 4 }} />
        
        <Typography variant="h1" component="h1" gutterBottom fontWeight="bold" color="primary.main">
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom>
          Страница не найдена
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mb: 4 }}>
          Похоже, что вы перешли по неверной ссылке. Возможно, страница была перемещена или удалена.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/"
            size="large"
          >
            Вернуться на главную
          </Button>
          
          <Button
            variant="outlined"
            component={RouterLink}
            to="/products"
            size="large"
          >
            Перейти в каталог
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFoundPage;