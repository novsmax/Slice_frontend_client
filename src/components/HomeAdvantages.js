import React from 'react';
import { Typography, Box, Container, Grid, Card, CardMedia, CardContent, Divider } from '@mui/material';

const advantagesData = [
  {
    id: 1,
    title: 'Официальная гарантия',
    description: 'На все товары распространяется официальная гарантия производителя',
    icon: '📜'
  },
  {
    id: 2,
    title: 'Быстрая доставка',
    description: 'Доставляем заказы по всей России в кратчайшие сроки',
    icon: '🚚'
  },
  {
    id: 3,
    title: 'Безопасная оплата',
    description: 'Используем современные протоколы защиты платежей',
    icon: '🔒'
  },
  {
    id: 4,
    title: 'Техническая поддержка',
    description: 'Наши специалисты всегда готовы помочь с выбором или настройкой',
    icon: '🛠️'
  }
];

const brandsData = [
  { id: 1, name: 'Apple', logo: 'https://via.placeholder.com/150x80?text=Apple' },
  { id: 2, name: 'Samsung', logo: 'https://via.placeholder.com/150x80?text=Samsung' },
  { id: 3, name: 'Xiaomi', logo: 'https://via.placeholder.com/150x80?text=Xiaomi' },
  { id: 4, name: 'Huawei', logo: 'https://via.placeholder.com/150x80?text=Huawei' },
  { id: 5, name: 'Lenovo', logo: 'https://via.placeholder.com/150x80?text=Lenovo' },
  { id: 6, name: 'Sony', logo: 'https://via.placeholder.com/150x80?text=Sony' }
];

const HomeAdvantages = () => {
  return (
    <Box sx={{ bgcolor: '#f8f8f8', py: 6 }}>
      <Container>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" fontWeight="bold">
          Почему выбирают нас
        </Typography>
        
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 5 }}>
          Slice - ваш надежный партнер в мире электроники
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {advantagesData.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <Box sx={{ fontSize: 48, mb: 2 }}>
                  {item.icon}
                </Box>
                <CardContent sx={{ textAlign: 'center', flex: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ my: 5 }} />
        
        <Typography variant="h5" component="h3" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Официальный партнер ведущих производителей
        </Typography>
        
        <Grid container spacing={3} justifyContent="center">
          {brandsData.map((brand) => (
            <Grid item key={brand.id} xs={6} sm={4} md={2}>
              <Card sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: 100,
                filter: 'grayscale(100%)',
                transition: 'all 0.3s',
                '&:hover': {
                  filter: 'grayscale(0%)',
                  transform: 'scale(1.05)'
                }
              }}>
                <CardMedia
                  component="img"
                  image={brand.logo}
                  alt={brand.name}
                  sx={{ 
                    maxHeight: 80, 
                    maxWidth: '80%', 
                    objectFit: 'contain'
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomeAdvantages;